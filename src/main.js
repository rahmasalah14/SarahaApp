import express from "express";
import {  globalErrorHandling } from "./middleware/index.js";
import { PORT } from "./config.js";
import { authenticationController, messageController, userController } from "./modules/index.js";
import { bootstrapDB } from "./DB/connection.db.js";
import crypto from 'node:crypto'
import bodyParser from "body-parser";
import cors from "cors";

console.log(crypto.randomBytes(16).toString('hex'))

const app = express();
const port = PORT

bootstrapDB(app, port);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/authentication",authenticationController);

app.use("/message",messageController);

app.use("/user",userController);

app.get('/protected', (req, res) => {
  res.send('This is a protected route');
});
app.use(globalErrorHandling);
