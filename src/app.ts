
import express, { Application, Request, Response } from "express"
import { IndexRoute } from "./routes";
import { notFound } from "./middleware/notFound";

import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import path from "path"
import cors from "cors"
import { envVars } from "./config/env";
import { errorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(),`src/templates`));

app.post("/webhook", express.raw({type:"application/json"}), async (req:Request,res:Response)=>{
  console.log("Webhook received:",req.body);
  res.status(200).json({received:true})
  
  // const sig = req.headers['stripe-signature'] as string;
  // const stripe = require("stripe")(envVars.STRIPE_SECRET_KEY);
  // let event;  
})
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
app.use(express.urlencoded({extended:true}))

app.use("/",IndexRoute)

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello ShopFlow API');
});
app.use(errorHandler)
app.use(notFound)

export default app