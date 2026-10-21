import { UserModel } from "../../DB/model/index.js";
import { ProviderEnum } from "../../common/enum/user.gender.js";
import { ConflictException, UnauthorizedException , NotFoundException} from "../../common/exceptions/error.exception.js";
import {findOne , createOne} from '../../common/repository/index.js'
import { hash , compare, createToken, createLoginCredentials} from "../../common/security/index.js";
import { encryption , decryption } from "../../common/security/index.js";
import {WEB_CLIENT_IDS} from '../../config.js'
import {OAuth2Client} from 'google-auth-library';

/*
{
  payload: {
    iss: 'https://accounts.google.com',
    azp: '464151129593-ficu784i117qknhf0g73gu9tai2i2rnu.apps.googleusercontent.com',
    aud: '464151129593-ficu784i117qknhf0g73gu9tai2i2rnu.apps.googleusercontent.com',
    sub: '105379316835608499445',
    email: 'rahmasalah1422@gmail.com',
    email_verified: true,
    nonce: 'not_provided',
    nbf: 1792600833,
    name: 'Rahma Salah',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocIgR4MgnUUime32KFKdD9OZaVPd_KE0cLgbKgsvOrcEwMnnO8z5=s96-c',
    given_name: 'Rahma',
    family_name: 'Salah',
    iat: 1792601133,
    exp: 1792604733,
    jti: '53d20c0483db9649d8c8da3a65f6b674e8a2a0a8'
  }
}

*/


const client = new OAuth2Client();

async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_IDS
  });
  const payload = ticket.getPayload();
    if(!payload.email_verified)
  {
    throw BadRequestException({message:"Email not verified"});
  }
  return payload;

}

export const signup = async ({email,password, username, phone}) =>
{
    // const salt = await bcrypt.genSalt(12, "a");

  const duplicatedUser = await findOne({
    model:UserModel, 
    filter:{email}, 
    options:{select:"email"}
});

  if(duplicatedUser)
  {
    throw ConflictException({message:"Email already exists"});
  }

  const user = await createOne({
    model:UserModel,
    data:{
        email,
        password: await hash(password),
        phone: await encryption(phone),
        username
        }
  });

  return user;

}

export const signupWithGmail = async ({idToken},issuer) =>
{
   const {name , email , picture} = await verifyGoogleAccount(idToken);
   const existAccount = await findOne({
    model:UserModel,
    filter:{email}
   })
   if(existAccount){
    if(existAccount.provider !== ProviderEnum.GOOGLE){
      throw ConflictException({message:"Account already exists with a different provider, please login with your email and password"});
    }
   return {status:200,tokens: await createLoginCredentials({user:existAccount, issuer})};
   }
   const user = await createOne({
    model: UserModel, 
    data:{
      username:name,
      email,
      confirmedEmail:new Date(),
      provider:ProviderEnum.GOOGLE,
      image: picture
    }
   })
   return {status:201,tokens: await createLoginCredentials({user, issuer})};
}

export const loginWithGmail = async (account, issuer) =>
{
  return await createLoginCredentials({user:account,issuer});
}

export const login = async ({email,password}, issuer) =>
{
  const user = await findOne({
    model:UserModel, 
    filter:{email , provider:ProviderEnum.SYSTEM},
   });

  if(!user){
    throw NotFoundException({message:"User not found"});
  }


 const match = await compare(password, user.password);

  if(!match){
    throw NotFoundException({message:"User not found"});
  }

  user.phone = await decryption(user.phone);

  return await createLoginCredentials({user,issuer});

}

    //   const token = jwt.sign(
    //     { },
    //     SECRET_KEY,
    //     {subject: user.id,
    //     //  expiresIn: "1h", 
    //     issuer,
        
    //     // audience: ["ws" , "x"]
        
    //   }
    // );
