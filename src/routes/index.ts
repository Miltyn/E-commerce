import { Router } from "express";
import authrouter from "./authRouter";
import routerProduct from "./productRouter";
import routerCategory from "./categoryRouter";
import routerOrder from "./orderRouter";

const rootRouter = Router();

rootRouter.use("/auth", authrouter);
rootRouter.use("/product", routerProduct);
rootRouter.use("/category", routerCategory );
rootRouter.get("/order", routerOrder);

export { rootRouter };