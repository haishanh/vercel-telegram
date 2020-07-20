import { build } from "./index";

const app = build();

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
