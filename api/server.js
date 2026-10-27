const http = require('node:http');
const fs = require('node:fs');

const DATA_FILE = '/data/visits.txt';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.url === '/visits') {
    let visits = 0;

    try {
      visits = Number(fs.readFileSync(DATA_FILE, 'utf8')) || 0;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Cannot read counter' }));
        return;
      }
    }

    visits += 1;

    try {
      fs.writeFileSync(DATA_FILE, String(visits));
    } catch (error) {
      console.error('Cannot save counter:', error.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Cannot save counter' }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({ visits }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, '0.0.0.0', () => {
  console.log('API listening on port 3000');
});
