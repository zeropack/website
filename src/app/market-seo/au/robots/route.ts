export const dynamic = "force-static";

export function GET() {
  const body = ["User-agent: *", "Allow: /", "", "Sitemap: https://www.zeropack.au/sitemap.xml", ""].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
