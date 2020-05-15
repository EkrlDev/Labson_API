const http = require('http');

const todos = [
  { id: 1, text: 'Todo1' },
  { id: 2, text: 'Todo2' },
  { id: 3, text: 'Todo3' },
  { id: 4, text: 'Todo4' },
];

const server = http.createServer((req, res) => {
  const { headers, url, method } = req;
  //console.log(headers, url, method);
  //sending header
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  console.log(req.headers.authorization);

  res.end(
    JSON.stringify({
      success: true,
      data: todos,
    })
  );
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
