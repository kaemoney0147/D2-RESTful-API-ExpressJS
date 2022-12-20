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
    avatar: `https://ui-avatars.com/api/?name=${request.body.firstname}+${request.body.lastname}`,
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
  const fileRead = fs.readFileSync(aurthorJsonPath); //to read the file
  console.log("this is the file content", fileRead);
  const covertDataToString = JSON.parse(fileRead); // convert the file to json format
  console.log("data converted to string", covertDataToString);
  response.send(covertDataToString);
});
authorsRouter.get("/:authorId", (request, response) => {
  const authorId = request.params.authorId;
  console.log("this is aurthorid", aurthorId);
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  const author = fileRead.find((author) => author.id === authorId);
  response.send(author);
});

authorsRouter.put("/:authorId", (request, response) => {
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  const indexOfArray = fileRead.findIndex(
    (author) => author.id !== request.params.authorId
  );
  const previousDetails = fileRead[indexOfArray];
  const editedDetails = {
    ...previousDetails,
    ...request.body,
    updatedAt: new Date(),
  };
  fileRead[indexOfArray] = editedDetails;
  fs.writeFileSync(aurthorJsonPath, JSON.stringify(fileRead));
  response.send(editedDetails);
});

authorsRouter.delete("/:authorId", (request, response) => {
  const fileRead = JSON.parse(fs.readFileSync(aurthorJsonPath));
  const aurthorsLeft = fileRead.filter(
    (aurthor) => aurthor.id !== request.params.authorId
  );
  fs.writeFileSync(aurthorJsonPath, JSON.stringify(aurthorsLeft));
  response.send();
});

export default authorsRouter;
