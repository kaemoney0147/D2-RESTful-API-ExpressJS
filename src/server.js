import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/users/index.js";

const server = express();
const port = 3001;

server.use(express.json());

server.use("/users", authorsRouter);
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("this server is running on port", port);
});
