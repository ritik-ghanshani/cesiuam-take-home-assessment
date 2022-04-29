const knex = require("knex");
const restify = require("restify");

const connectionString = require("./connectionString");

const client = knex({
  client: "pg",
  connection: connectionString,
});

const server = restify.createServer();
server.pre(restify.pre.sanitizePath());
server.pre(restify.pre.userAgentConnection());
server.listen(8080);

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  const shutdownTimeout = setTimeout(function () {
    console.log("Shutdown failed, terminating process.");
    process.exit(0);
  }, 5000);

  console.log("Closing server connections...");
  server.close(() => {
    console.log("Closing database connections...");
    client.destroy();
    clearTimeout(shutdownTimeout);
    console.log("Shutdown successful.");
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
