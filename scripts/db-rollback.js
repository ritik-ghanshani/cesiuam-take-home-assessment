const knex = require("knex");
const path = require("path");
const connectionString = require("../connectionString");

const client = knex({
  client: "pg",
  connection: connectionString,
});

client.migrate
  .rollback()
  .then((results) => {
    const list = results[1];
    if (list.length === 0) {
      console.log("Already rolled back all versions.");
    } else {
      list.forEach((item) =>
        console.log("Unapplied: " + path.relative(__dirname, item))
      );
    }
  })
  .catch((e) => console.log(e))
  .finally(() => client.destroy())
  .catch((e) => console.log(e));
