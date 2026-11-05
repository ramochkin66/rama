exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { text } = JSON.parse(event.body);
    
    // ТУТ ТВОЙ НОВЫЙ ID И ТОКЕН
    const TG_TOKEN = '9241250601:AAH6ve3fGoix0sQCVbA9rMh30WUYxA1B75w';
    const TG_CHAT  = '6465008615';

    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: text, parse_mode: 'HTML' })
    });

    return { statusCode: res.ok ? 200 : 500, body: 'ok' };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};