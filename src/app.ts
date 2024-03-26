import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Home } from "./utils/functions/redirect";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';


const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", Home);

export default app;
