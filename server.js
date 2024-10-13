// Server to run for production frontend
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = require("http").Server(app);
const port_server = 4000;
server.listen(port_server, () => {
  console.log(`[server]: Server is running at http://localhost:${port_server}`);
});
