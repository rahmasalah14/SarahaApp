import { UserModel } from "../../DB/model/index.js";
import { ConflictException, UnauthorizedException , NotFoundException} from "../../common/exceptions/error.exception.js";
import {findOne , createOne} from '../../common/repository/index.js'
import { hash , compare} from "../../common/security/index.js";
import { encryption , decryption } from "../../common/security/index.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../../config.js";
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

export const login = async ({email,password}) =>
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
      const token = jwt.sign(
        { userId: user._id },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

  user.phone = await decryption(user.phone);
  return { user, token };
}