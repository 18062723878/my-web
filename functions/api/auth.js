export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const inputPwd = body.password;
    const realPwd = env.ADMIN_PASSWORD;

    if (!realPwd) {
      return new Response(JSON.stringify({ ok: false, error: "服务端未配置密码" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (inputPwd === realPwd) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ ok: false, error: "密码错误" }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
