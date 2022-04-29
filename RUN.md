# How to run

If node and postgres are already installed, you can run the following command to start the server:

```
npm run start
```

# How to run - Alternative

If you use VSCode, I have added a dev container which takes care of preinstalling all the dependencies. 

Pre-requisites for dev containers:
- Docker Desktop
- [Remote Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

When you open the project, VS Code will show a popup in the bottom right corner. Click on the "Open in Container" button. 

It should take 2-3 minutes to build the container and start it.

It also automatically installs SQLTools extension which makes it easier to view the contents of the database.

# Create the database

- Run the following command to create the database:

```
npm run db-migration
```
- For the main database, you will have to send a GET request to /create_materials_table.

# Seed test data

- Seed the construction sites table with this command:

```
npm run db-seed
```

- For the material table, you will have to send a GET request to /seed. 

Note: I had added the seed functionality to db-seed.js before but the instructions stated that API should be able to seed the database and manage the schema so I converted these functionalities into endpoints.

# My experience with this project

I spent around 3 hours on this project. I have never used knex or restify before so most of the time was spent looking up documentation.

I couldn't get jasmine to work and I ran out of time while trying to figure out why. Everytime I tried to run a dummy test, it would say "spec not found".

Some instructions were unclear to me, like "provides a mechanism for creating a new database" and "provide a way to seed the database with test data". Unfortunately, my midterms ended on Thursday and I only got time to work on this after that, so I couldn't ask any questions.

