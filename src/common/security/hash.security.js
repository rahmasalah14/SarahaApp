import bcrypt from "bcrypt";

export const hash = async (plainText, rounds=12, minor="b")=>{

    const salt = (await  bcrypt.genSalt(rounds, minor)).toString();

    return await bcrypt.hash(plainText, salt);

}

export const compare = async (plainText, cipherText)=>{  

    return await bcrypt.compare(plainText, cipherText);

}




// export const hash = async ({plainText, rounds=12, minor="b", approach="bcrypt"}={})=>{
//    let cipherText=""
//     switch(approach){
//         case "bcrypt":
//             const salt = (await  bcrypt.genSalt(rounds, minor)).toString();
//             cipherText = await bcrypt.hash(plainText, salt);
//             break;
//         case "argon2":
//             cipherText = await argon2.hash(plainText);
//             break;
//         default:
//             throw new Error("Invalid hashing approach");
//     }
   
//   return cipherText;
// }

// export const compare = async ({plainText, cipherText,  approach="bcrypt"}={})=>{  
//     switch(approach){
//         case "bcrypt":
//             return await bcrypt.compare(plainText, cipherText);
//         case "argon2":
//             return await argon2.verify(cipherText, plainText);
//         default:
//             throw new Error("Invalid comparison approach");
//     }
// }