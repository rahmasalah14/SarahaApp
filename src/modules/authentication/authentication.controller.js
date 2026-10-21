import {Router } from 'express';
import {successResponse} from "../../common/utils/success.response.js";
import { login, signup, signupWithGmail } from './authentication.service.js';
import * as validators from './authentication.validation.js';
import { validation } from '../../middleware/validation.middleware.js';
const router = Router();

router.post("/signup", validation(validators.signup), async (req,res,next)=>{

    const data = await signup(req.body)
    return successResponse({
        res,
        data,
        message: "User signed up successfully"
    });
}
)
router.post("/signup-with-gmail", async (req,res,next)=>{
    const {status, tokens} = await signupWithGmail(req.body , `${req.protocol}://${req.host}`)
    return successResponse({
        res,
        data:tokens,
        message: "User signed up successfully"
    });
}
)
router.post("/login", validation(validators.login), async (req,res,next)=>{
  
      const validationResult =  validators.login.safeParse(req.body);
    if(!validationResult.success)
    {
      throw BadRequestException("Validation Error", validationResult.error.issues );
    }
    const data = await login(req.validate , `${req.protocol}://${req.host}`)
    return successResponse({
        res,
        data,
        message: "User logged in successfully"
    });}
)

export default router;