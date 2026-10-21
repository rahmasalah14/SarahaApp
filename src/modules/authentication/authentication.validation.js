import {z} from "zod";

export const login = z.object({
    email:z.email(),
    password:z.string().min(8).max(16)
})
// 
// .catchall(z.number())


export const signup = login.safeExtend({
    username:z.string(),
    phone:z.e164(),
    confirmPassword:z.string().min(8).max(16)
}).superRefine((data,ctx)=>{
    if( data.password != data.confirmPassword)
    {
        ctx.addIssue({
            code:"custom",
            path:['confirmPassword'],
            message:"password mismatch with confirmation password"
        })
    }
    
    if( data.username.includes(" "))
    {
        ctx.addIssue({
            code:"custom",
            path:['username'],
            message:"username must contain 2 parts"
        })
    }
})

/*
.refine((data)=>{
    return data.password == data.confirmPassword
},{message:"password mismatch with confirmation password"})

*/ 