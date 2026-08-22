const KEY = "portfolio_data";

const DEFAULT_DATA = {
  site: {
    name: "我的作品集",
    heroTitle: "你好，我是开发者",
    heroSub: "欢迎来到我的个人网站"
  },
  timeline: []
};

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const raw = await env.PORTFOLIO_KV.get(KEY);
    const data = raw ? JSON.parse(raw) : DEFAULT_DATA;
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  try {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "");

    if (!env.ADMIN_PASSWORD || token !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ ok: false, error: "未授权" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    await env.PORTFOLIO_KV.put(KEY, JSON.stringify(body));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
