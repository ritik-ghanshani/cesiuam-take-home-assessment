const knex = require("knex");
const uuid = require("uuid");
const connectionString = require("../connectionString");

const client = knex({
  client: "pg",
  connection: connectionString,
});

async function main() {
  //Delete all existing sites and create some dummy sites.
  await client("construction_sites").delete();
  for (let i = 0; i < 10; i++) {
    const project = await client("construction_sites")
      .insert({
        id: uuid.v4(),
      })
      .returning("*");
    console.log(`Created construction site with id ${project[0].id}`);
  }
}

main()
  .catch((err) => {
    console.log(err);
  })
  .finally(() => client.destroy());
