const https = require('https');

exports.handler = async (event) => {
  // Добавляем заголовки CORS, чтобы браузер не блокировал ответ
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTION',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'ok' };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { text } = JSON.parse(event.body);
    const TG_TOKEN = '9241250601:AAH6ve3fGoix0sQCVbA9rMh30WUYxA1B75w';
    const TG_CHAT  = '6465008615';

    const postData = JSON.stringify({
      chat_id: TG_CHAT,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TG_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', () => {
          // ВСЕГДА возвращаем статус 200, чтобы браузер не паниковал
          resolve({ statusCode: 200, headers, body: JSON.stringify({ success: true }) });
        });
      });

      req.on('error', (error) => {
        resolve({ statusCode: 200, headers, body: JSON.stringify({ success: false, error: error.message }) });
      });

      req.write(postData);
      req.end();
    });

  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};