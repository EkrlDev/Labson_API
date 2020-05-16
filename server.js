const http = require('http');

const todos = [
  { id: 1, text: 'Todo1' },
  { id: 2, text: 'Todo2' },
  { id: 3, text: 'Todo3' },
];

const server = http.createServer((req, res) => {
  const { headers, url, method } = req;
  //console.log(headers, url, method);

  //sending header
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Self-Defined-Header': 'We defined this',
  });

  console.log(req.headers.authorization);

  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
      console.log(body);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      console.log(body);
    });

  res.end(
    JSON.stringify({
      success: true,
      data: todos,
    })
  );
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
