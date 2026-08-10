
import express, { Application, Request, Response } from "express"
import { categoriesRouter } from "./module/categories/categories.route";
const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/categories",categoriesRouter)

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello ShopFlow API');
});

export default app