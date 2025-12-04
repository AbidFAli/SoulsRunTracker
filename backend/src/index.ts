// eslint-disable-next-line @typescript-eslint/no-require-imports
import express = require("express")
// eslint-disable-next-line @typescript-eslint/no-require-imports
import cors = require("cors")
import type { CorsOptions } from "cors";

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


app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`)
});
