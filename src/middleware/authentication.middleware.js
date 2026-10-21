import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../config.js";
import { ForbiddenException, UnauthorizedException } from '../common/exceptions/error.exception.js';
import { decodeToken } from '../common/security/token.security.js';
import { TokenTypeEnum } from '../common/enum/index.js';
import { basicAuth } from '../common/security/token.security.js';


export const authentication = (tokenType = TokenTypeEnum.ACCESS)=>{
   return async (req, res, next) => {

    const {authorization} = req.headers;

    if(!authorization){
        return UnauthorizedException({res, message: "Authorization header is missing"});
    }

    const [key, credential] = authorization.split(" ") || [];

    if(key !== "Bearer" || !credential){
        return UnauthorizedException({res, message: "Invalid authorization header format"});
    }
    switch(key){
        case "Basic":
            const data = Buffer.from(credential, 'base64').toString('utf-8');
            const [email, password] = data.split(":");
            req.user = await basicAuth({email, password});
            break;
        
        case "Bearer":
        const {user, payload}= await decodeToken({authorization, tokenType});
        req.user = user;
        req.payload = payload;
            break;
        
        default:
            next(new Error("Invalid authorization Schema",{cause:{status:400}}));
        break;
    }

   next()
};
}
export const authorization = (accessRoles)=>{
   return async (req, res, next) => {

    if(!accessRoles.includes(req.user.role)){
        return ForbiddenException({res, message: "Insufficient privileges"});
    }


   next()
};
}

// export const authorization = (accessRole)=>{
//    return async (req, res, next) => {

//     if(req.user.role < accessRole){
//         return ForbiddenException({res, message: "Insufficient privileges"});
//     }


//    next()
// };
// }
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

    // if (token == null) return res.sendStatus(401);  // No token present

    // jwt.verify(token, SECRET_KEY, (err, user) => {
    //     if (err) return res.sendStatus(403);  // Invalid token

    //     req.user = user;
    //     next();
    // });