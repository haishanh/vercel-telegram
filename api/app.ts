import { build } from "./index";
import dotenv from "dotenv";

dotenv.config();

const app = build({ logger: true });

const start = async () => {
  try {
    await app.listen(3000);
    console.log(app.printRoutes());
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
