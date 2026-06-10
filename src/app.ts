import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(express.json());
// app.use("/auth", router);

app.get("/", (req: Request, res: Response) => {
  throw new Error("Server is dying");
  res.send("Hello World!");
});

export default app;
