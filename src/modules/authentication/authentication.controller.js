import {Router } from 'express';
import {successResponse} from "../../common/utils/success.response.js";
import { login, signup } from './authentication.service.js';


const router = Router();

router.post("/signup", async (req,res,next)=>{
    const data = await signup(req.body)
    return successResponse({
        res,
        data,
        message: "User signed up successfully"
    });
}
)

router.post("/login", async (req,res,next)=>{
    const data = await login(req.body)
    return successResponse({
        res,
        data,
        message: "User logged in successfully"
    });}
)


export default router;