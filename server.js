const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Log the origin of the request

  // Set the Access-Control-Allow-Origin header to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Check if the request is for the index.html file
  if (req.url === '/' || req.url === '/index.html') {
    // Read the index.html file
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }
      console.log('Request origin:', req.headers);

      // Set the Content-Type header to indicate that the response is HTML
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self' chrome-extension://*");
      // Send the HTML content
      res.end(data);
    });
  } else {
    // If the request is for any other resource, send a 404 Not Found response
    res.statusCode = 404;
    res.end('404 Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
