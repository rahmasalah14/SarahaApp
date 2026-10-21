import jwt from 'jsonwebtoken'
import {ACCESS_ADMIN_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNATURE ,  REFRESH_ADMIN_TOKEN_SIGNATURE,  REFRESH_TOKEN_EXPIRES_IN,  REFRESH_USER_TOKEN_SIGNATURE} from '../../config.js'
import { BadRequestException, NotFoundException } from '../exceptions/error.exception.js'
import { findById, findOne } from '../repository/base.repository.js'
import { UserModel } from '../../DB/model/user.model.js'
import { RoleEnum, TokenTypeEnum } from '../enum/index.js'
import { compare } from './hash.security.js'
import { decryption } from './encryption.security.js'

export const createToken = async({
    payload={},
    options={},
    secret=ACCESS_USER_TOKEN_SIGNATURE
}={})=>{
    return jwt.sign(payload, secret, options)
} 

export const verifyToken = async({
    token="",
    secret=ACCESS_USER_TOKEN_SIGNATURE
}={})=>{
    return jwt.verify(token, secret)
}

const getTokenSignatures = async({role = RoleEnum.USER}={})=>{
    let signatures ;
    switch(role){
        case RoleEnum.USER:
            signatures = {accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE};
            break;
        case RoleEnum.ADMIN:
            signatures = {accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE};
            break;
        default:
            signatures = {accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE};
    }
    return signatures;
}

const getSignature = async({tokenType = TokenTypeEnum.ACCESS, role=RoleEnum.USER}={})=>{
    const signatures = await getTokenSignatures({role});
    return tokenType === TokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature
}

export const decodeToken = async({
    authorization="",
    tokenType=TokenTypeEnum.ACCESS
}={})=>{
    const decoded = jwt.decode(authorization);
    if(!decoded?.aud?.length){
    throw BadRequestException("missing token in payload")
    }

    const secret = await getSignature({tokenType,role:decoded.aud[0]});
    const payload = await verifyToken({token : authorization, secret});
   if(!payload?.sub){
    throw BadRequestException("missing token in payload")
   }


   const account = await findById({model: UserModel, id: payload.sub})
   if(!account){
    throw NotFoundException("account not found")
   }
   return { user: account, payload }
}

export const createLoginCredentials = async({
    user,
    issuer,
    options={}
}={})=>{

       const {accessSignature, refreshSignature} = await getTokenSignatures({role: user.role});

       const token = await createToken({
           payload: {sub: user._id},
            secret: accessSignature,
            options: {
                ...options,
                issuer,
                audience:[user.role],
                expiresIn : ACCESS_TOKEN_EXPIRES_IN
            }
          })
      
          const refresh_token = await createToken({
            payload: {sub: user._id},
            options: {
                ...options,
                issuer,
                 audience:[user.role],
                expiresIn : REFRESH_TOKEN_EXPIRES_IN
            }
            , secret: refreshSignature
          })
          return { token, refresh_token };
}

export const basicAuth =  async ({email,password}) =>
{
  const user = await findOne({
    model:UserModel, 
    filter:{email}
   });

  if(!user){
    throw NotFoundException({message:"User not found"});
  }


 const match = await compare(password, user.password);

  if(!match){
    throw NotFoundException({message:"User not found"});
  }

  user.phone = await decryption(user.phone);

  return user

}
