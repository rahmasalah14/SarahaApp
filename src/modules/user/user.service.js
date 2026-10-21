import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN,REFRESH_TOKEN_SIGNATURE,SECRET_KEY } from '../../config.js';
import { UserModel } from '../../DB/model/user.model.js';
import { findByIdAndUpdate } from '../../common/repository/index.js';
import { ConflictException } from '../../common/exceptions/error.exception.js';
import { createLoginCredentials, createToken } from '../../common/security/token.security.js';

export const profile = async (user)=>{
    return user;
}

export const update = async (user, updateData)=>{
   const account = await findByIdAndUpdate({model: UserModel, id: user._id, update: updateData});
    return account;
}

export const rotateToken = async (payload,user,issuer)=>{
  const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000;
  const currentTime = Date.now()+(5*60000);
  if(currentTime > accessExpiresIn){
    throw ConflictException({message:"Access token has expired, please login again"});
  }
    return await createLoginCredentials({user, issuer});
}