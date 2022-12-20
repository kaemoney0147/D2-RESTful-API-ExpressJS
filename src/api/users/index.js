import e, { response } from "express";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

const aurthorJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "users.json"
);
console.log("CURRENTS FILE URL: ", import.meta.url);
console.log("CURRENTS FILE PATH: ", fileURLToPath(import.meta.url));
console.log("PARENT FOLDER PATH: ", dirname(fileURLToPath(import.meta.url)));
console.log(
  "TARGET: ",
  join(dirname(fileURLToPath(import.meta.url)), "users.json")
);

authorsRouter.post("/", (request, response) => {
  console.log("Requet body", request.body);
  const newAurthor = {
    ...request.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  fileRead.push(newAurthor);
  fs.writeFileSync(aurthorJsonPath, JSON.stringify(fileRead));
  response.status(200).send({ id: newAurthor.id });
});

authorsRouter.get("/", (request, response) => {
  const fileRead = fs.readFileSync(aurthorJsonPath);
  console.log("this is the file content", fileRead);
  const covertDataToString = JSON.parse(fileRead);
  console.log("data converted to string", covertDataToString);
  response.send(covertDataToString);
});
authorsRouter.get("/:aurthorId", (request, response) => {
  const aurthorId = request.params.aurthorId;
  console.log("this is aurthorid", aurthorId);
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  const aurthor = fileRead.find((aurthor) => aurthor.id === aurthorId);
  response.send(aurthor);
});

authorsRouter.put("/:aurthorId", (request, response) => {
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  const indexOfArray = fileRead.findIndex(
    (aurthor) => aurthor.id !== request.params.aurthorId
  );
  const previousDetails = file[indexOfArray];
  const editedDetails = {
    ...previousDetails,
    ...request.body,
    updatedAt: new Date(),
  };
  fileRead[indexOfArray] = editedDetails;
  fs.writeFileSync(aurthorJsonPath, JSON.stringify(fileRead));
  response.send(editedDetails);
});

authorsRouter.delete("/:aurthorId", (request, response) => {
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  const aurthorsLeft = fileRead.filter(
    (aurthor) => aurthor.id !== request.params.aurthorId
  );
  fs.writeFileSync(aurthorJsonPath, JSON.stringify(aurthorsLeft));
  response.send();
});

export default authorsRouter;
