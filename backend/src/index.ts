// eslint-disable-next-line @typescript-eslint/no-require-imports
import express = require("express")
// eslint-disable-next-line @typescript-eslint/no-require-imports
import cors = require("cors")
import type { CorsOptions } from "cors";

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { schema } from "./api/schema.js";


function createCorsHandler(){
  const corsOptions: CorsOptions = {
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: /http:\/\/localhost/
  };

  return cors(corsOptions);
}
const app = express();
app.use(createCorsHandler());
app.use(express.json());
const server = new ApolloServer({schema,
  introspection: process.env.NODE_ENV === 'development'
});
await server.start();
app.use(
  '/api/graphql', cors(), express.json(), expressMiddleware(server)
)




app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${process.env.BACKEND_PORT}`)
});
