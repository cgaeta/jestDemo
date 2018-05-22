const http = require("http");
const pr = require("./promisify").pr;

const server = () => http.createServer((req, res) => {
  if (!req.url.includes("favicon")) {
    res.writeHead(200, {"Content-Type": "text/html"});
    pr.readdir("./dist")
    .then(data => {
      let files = data.filter(f =>
        !req.url.includes("?") ? f.includes(req.url.substring(1)) :
          f.includes(req.url.substring(1, req.url.indexOf("?"))));
      return pr.readFile("./dist/" + files[0])
    })
    .then(data => {
      res.write(data);
      res.end();
    }).catch ((err) => {
      console.log(err);
      res.write("<h2>404 - Couldn't find that page</h2>");
      res.end();
    });
  } else {
    res.end();
  }
});

const start = () => server.listen(8080, () => console.log("listening on port 8080"));

const stop = () => server.close(() => console.log("server is closed"));

module.exports = {
  server,
  start,
  stop
};
