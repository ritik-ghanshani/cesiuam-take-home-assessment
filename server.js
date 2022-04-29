const knex = require("knex");
const restify = require("restify");
const connectionString = require("./connectionString");
const corsMiddleware = require("restify-cors-middleware2");
const uuid = require("uuid");

const client = knex({
  client: "pg",
  connection: connectionString,
});

const server = restify.createServer();

// TP: plugin to enable request body to be parsed

server.use(restify.plugins.bodyParser(
  { mapParams: true }
));

// TP: enabling all CORS requests to save time, would definitely customize this for production
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["*"],
  exposeHeaders: ["*"]
});

server.pre(cors.preflight);
server.use(cors.actual);
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

// API to create a materials table
server.get("/create_materials_table", async (req, res, next) => {
  await client.schema.createTable("materials", (table) => {
    table.string("name");
    table.string("volume");
    table.string("cost");
    table.string("color");
    table.string("delivery_date");
    table.uuid("construction_site_id").references("id").inTable("construction_sites").onDelete("CASCADE");
  });
  res.send(200);
  next();
}); 

// API to delete migration table
server.get("/delete_materials_table", async (req, res, next) => {
  await client.schema.dropTable("materials");
  res.send(200);
  next();
});


// API to fetch all materials for a construction site
server.get("/materials/:construction_site_id", async (req, res, next) => {
  const { construction_site_id } = req.params;
  const materials = await client.select().from("materials").where({ construction_site_id });
  res.send(materials);
  next();
});

// API to create a new material 
server.post("/materials", async (req, res, next) => {
  const { name, volume, cost, color, delivery_date, construction_site_id } = req.body;
  await client.insert({
    name,
    volume,
    cost,
    color,
    delivery_date,
    construction_site_id,
  }).into("materials").then(() => {
    res.send(201);
  });
  next();
}
);

// API to delete a material
server.del("/materials", async (req, res, next) => {
  const { name, construction_site_id } = req.body;
  await client.del().from("materials").where({
    name, construction_site_id
  }).then(() => {
    res.send(204);
  });
  next();
}
);

// API to edit a material using construction_site_id
server.put("/materials", async (req, res, next) => {
  const { name, volume, cost, color, delivery_date, construction_site_id } = req.body;
  await client.update({
    name,
    volume,
    cost,
    color,
    delivery_date,
    construction_site_id,
  }).into("materials").where({
    name, construction_site_id
  }).then(() => {
    res.send(204);
  });
  next();
}
);

// API to display total cost of material for a specific construction site
server.get("/materials/total_cost", async (req, res, next) => {
  const { construction_site_id } = req.query;
  await client.select("cost").from("materials").where({
    construction_site_id,
  }).then((rows) => {
    let totalCost = 0;
    rows.forEach((row) => {
      totalCost += parseInt(row.cost);
    });
    res.send(totalCost);
    next();
  });
}
);

// API to get all construction sites
server.get("/construction_sites", async (req, res, next) => {
  await client.select().from("construction_sites").then((rows) => {
    res.send(rows);
    next();
  });
});

// Seed API to create 100 materials randomly
server.get("/seed", async (req, res, next) => {
  await client.select().from("construction_sites").then((rows) => {
    const constructionSites = [];
    rows.forEach((row) => {
      constructionSites.push(row.id);
    });
    matertialData = [];
    for (let i = 0; i < 100; i++) {
      const name = "Material " + i;
      const volume = Math.floor(Math.random() * 100) + 1;
      const cost = Math.floor(Math.random() * 100) + 1;
      const color = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "white"][Math.floor(Math.random() * 10)];
      const delivery_date = new Date(new Date().getTime() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
      const construction_site_id = constructionSites[Math.floor(Math.random() * constructionSites.length)];
      
      matertialData.push({
        name,
        volume,
        cost,
        color,
        delivery_date,
        construction_site_id,
      });

    }
  });
  await client.insert(matertialData).into("materials");

  res.send(201);
  next();
});

