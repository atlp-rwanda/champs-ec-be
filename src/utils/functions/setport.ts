import app from "../../app";

const setPort = (appPort: string) =>
  app.listen(appPort, () => {
    console.log(`App is running at port ${appPort}`);
  });

export default setPort;
