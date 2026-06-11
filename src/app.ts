import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { router } from "./api/routes/auth.route";

const app: Application = express();

app.use(express.json());
app.use("/api/auth", router);

app.get("/", (req: Request, res: Response) => {
  throw new Error("Server is dying");
});

export default app;
