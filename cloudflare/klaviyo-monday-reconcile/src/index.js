const RECONCILE_URL = "https://www.zeropack.co/api/integrations/klaviyo-monday/reconcile";

export default {
  async scheduled(controller, env) {
    if (!env.CRON_SECRET) {
      throw new Error("Missing CRON_SECRET Worker secret.");
    }

    const startedAt = new Date().toISOString();
    const response = await fetch(RECONCILE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.CRON_SECRET}`,
        "User-Agent": "cloudflare-worker/zeropack-klaviyo-monday-reconcile",
      },
    });

    const body = await response.text();

    if (!response.ok) {
      throw new Error(
        `Reconcile failed with HTTP ${response.status}: ${body.slice(0, 1000)}`,
      );
    }

    console.log(
      JSON.stringify({
        ok: true,
        cron: controller.cron,
        scheduledTime: new Date(controller.scheduledTime).toISOString(),
        startedAt,
        completedAt: new Date().toISOString(),
        response: body.slice(0, 2000),
      }),
    );
  },
};
