import express from "express";
import { authenticateToken, globalErrorHandling } from "./middleware/index.js";
import { PORT } from "./config.js";
import { authenticationController, messageController, userController } from "./modules/index.js";
import { bootstrapDB } from "./DB/connection.db.js";
import crypto from 'node:crypto'
import bodyParser from "body-parser";


console.log(crypto.randomBytes(16).toString('hex'))

const app = express();
const port = PORT

bootstrapDB(app, port);
app.use(bodyParser.json());
app.use(express.json());

app.use("/authentication",authenticationController);

app.use("/message",messageController);

app.use("/user",userController);

app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});
app.use(globalErrorHandling);
