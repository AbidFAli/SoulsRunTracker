// eslint-disable-next-line @typescript-eslint/no-require-imports
import express = require("express")

const app = express();

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`)
});
