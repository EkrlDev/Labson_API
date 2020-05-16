const http = require('http');

const todos = [
  { id: 1, text: 'Todo1' },
  { id: 2, text: 'Todo2' },
  { id: 3, text: 'Todo3' },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      let status = 404;
      const response = {
        success: false,
        data: null,
        errore: null,
      };

      if (method === 'GET' && url === '/todos') {
        status = 200;
        response.success = true;
        response.data = todos;
      } else if (method === 'POST' && url === '/todos') {
        const { id, text } = JSON.parse(body);
        if (!id || !text) {
          status = 400;
          response.errore = 'Please add id or text';
        } else {
          todos.push({ id, text });
          status = 201;
          response.success = true;
          response.data = todos;
        }
      }
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Self-Defined-Header': 'We defined this',
      });
      res.end(JSON.stringify(response));
    });
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
