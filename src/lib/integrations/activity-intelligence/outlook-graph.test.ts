import assert from "node:assert/strict";
import test from "node:test";
import { previewOutlookGraph } from "./outlook-graph";

function restoreEnv() {
  const old = {
    MS_GRAPH_TENANT_ID: process.env.MS_GRAPH_TENANT_ID,
    MS_GRAPH_CLIENT_ID: process.env.MS_GRAPH_CLIENT_ID,
    MS_GRAPH_CLIENT_SECRET: process.env.MS_GRAPH_CLIENT_SECRET,
    MS_GRAPH_MAILBOX: process.env.MS_GRAPH_MAILBOX,
  };
  process.env.MS_GRAPH_TENANT_ID = "tenant";
  process.env.MS_GRAPH_CLIENT_ID = "client";
  process.env.MS_GRAPH_CLIENT_SECRET = "test-secret";
  process.env.MS_GRAPH_MAILBOX = "hello@zeropack.co";
  return () => { for (const [key, value] of Object.entries(old)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }};
}

test("scoped preview never reads outside configured mailbox and never returns email bodies", async () => {
  const reset = restoreEnv();
  const previous = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input); urls.push(url);
    if (url.includes("/oauth2/")) return Response.json({ access_token: "testing" });
    if (url.includes("inbox")) return Response.json({ value: [{
      id: "in1", internetMessageId: "<in1@test>", from: {emailAddress:{address:"customer@example.test"}},
      toRecipients: [{emailAddress:{address:"hello@zeropack.co"}}],
      receivedDateTime: new Date().toISOString(), subject: "Request for quotation",
      body: { content: "never return this content" },
    }]});
    return Response.json({ value: [{
      id: "out1", internetMessageId: "<out1@test>", from: {emailAddress:{address:"hello@zeropack.co"}},
      toRecipients: [{emailAddress:{address:"customer@example.test"}}],
      sentDateTime: new Date().toISOString(), subject: "Response",
    }]});
  };
  try {
    const result = await previewOutlookGraph(24, 2);
    assert.equal(result.scanned, 2);
    assert.equal(result.candidateCount, 2);
    assert.equal(result.mode, "dry_run");
    assert.ok(urls.filter(x => x.startsWith("https://graph.microsoft.com")).every(x => x.includes("/users/hello@zeropack.co/")));
    assert.equal(JSON.stringify(result).includes("customer@example.test"), false);
    assert.equal(JSON.stringify(result).includes("never return this content"), false);
  } finally { globalThis.fetch = previous; reset(); }
});

test("preview refuses incomplete pagination rather than silently clearing the inbox", async () => {
  const reset = restoreEnv(); const previous = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes("/oauth2/")
    ? Response.json({ access_token: "testing" })
    : Response.json({ value: [], "@odata.nextLink": "https://graph.microsoft.com/v1.0/users/hello@zeropack.co/mailFolders/inbox/messages?$skiptoken=next" });
  try { await assert.rejects(() => previewOutlookGraph(24, 1), /Incomplete Graph mailbox scan/); }
  finally { globalThis.fetch = previous; reset(); }
});

test("preview fails closed without matching configured mailbox", async () => {
  const reset = restoreEnv(); process.env.MS_GRAPH_MAILBOX = "unrelated@example.test";
  try { await assert.rejects(() => previewOutlookGraph(), /configuration incomplete/); }
  finally { reset(); }
});
