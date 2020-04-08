const express = require("express"); // importing a CommonJS module
const morgan = require("morgan"); // remember to require the module after installing it
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// middleware
server.use(logger);
server.use(helmet());

// place middleware here

// server.use(morgan("short")); // third party middleware, install it with npm
server.use(express.json()); // built-in middleware, no need to install it

// endpoints
server.use("/api/hubs", gatekeeper("mellon"), hubsRouter);

server.use(gatekeeper("hello"));

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.use((error, req, res, next) => {
  res.status(400).json({ error: "something broke!" });
});

module.exports = server;

function gatekeeper(password) {
  return function (req, res, next) {
    const { pass } = req.query;

    if (pass === password) {
      next(); // calls the next normal mw in the stack
    } else {
      next("failed"); // calls the next error handlling mw in the stack/queue
      // res.status(400).json({ message: "You shall not pass!" });
    }
  };
}

// the three amigas
function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl}`);

  next();
}

// write and use middleware that:
// read a "pass" key from req.query
// if he pass is "mellon", let the request continue
// otherwise respond with HTTP status code 400 and any message.
