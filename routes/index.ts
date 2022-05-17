import { Router } from "express";
import * as fs from "fs";
import chalk from "chalk";

const routes = Router();
// This function automatically maps whats in the routes folder and appends it to the api routes,
// its is a synchronous function which is, necessary; so that the server doesn't starts
// before the routes are loaded.

// * NOTE: In future this might be changed to an asynchronous function, cause this makes the startup
// * of the server slower.

fs.readdirSync("./routes").forEach((file: string) => {
  const fileName = file.split(".")[0];
  const events = require(`../routes/${fileName}`);

  if (fileName !== "index") {
    console.log(
      "-> Establishing routes for " + chalk.cyan.bold(fileName) + "..."
    );
    routes.use(`/api/v1/${fileName}`, events.default);
  }
});

export default routes;
