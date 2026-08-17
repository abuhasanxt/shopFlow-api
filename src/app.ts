
import express, { Application, Request, Response } from "express"
import { IndexRoute } from "./routes";
import { notFound } from "./middleware/notFound";
import errorHandler from "./middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import path from "path"
import cors from "cors"
import { envVars } from "./config/env";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(),`src/templates`));

app.use(cors({
  origin:[envVars.FRONTEND_URL,envVars.BETTER_AUTH_URL],
  credentials:true,
  methods:[" GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
}))

app.use("/api/auth",toNodeHandler(auth))

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.use("/",IndexRoute)

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello ShopFlow API');
});
app.use(errorHandler)
app.use(notFound)

export default app