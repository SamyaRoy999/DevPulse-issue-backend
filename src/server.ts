import app from "./app";
import config from "./config";
import { init } from "./db";

const main = async () => {
  //   console.log(config.database_url);
  init();
  app.listen(config.port, () => {
    console.log(`Example app listening on port 5000`);
  });
};

main();
