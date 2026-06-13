import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { router } from "./api/routes/auth.route";
import { issueRouter } from "./api/routes/issue.route";

const app: Application = express();

app.use(express.json());
app.use("/api/auth", router);
app.use("/api", issueRouter);

app.get("/", (req: Request, res: Response) => {
  throw new Error("Server is dying");
});

export default app;
