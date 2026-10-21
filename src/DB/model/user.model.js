import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/index.js";
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, "First name must be at least 3 characters long"],
        maxLength: [30, "First name must be at most 30 characters long"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last name must be at least 3 characters long"],
        maxLength: [30, "Last name must be at most 30 characters long"]
    },
    email:{
        required: true,
        unique: true,
        type: String
    },  
    password:{
        required: function(){
            return this.provider == ProviderEnum.SYSTEM
        },
        type: String
    },
    phone:{
        type: String,
    },
    DOB:Date,
    confirmEmail: Date,
    image:String,
    coverImage:[String],  
    gender:{
        type: Number,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    },
    role:{
       type: Number,
       enum: Object.values(RoleEnum),
       default: RoleEnum.USER 
    },
    provider:{
        type: Number,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.SYSTEM
    }
 }
,{
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
    autoIndex: true
})
userSchema.virtual("username").set(function(value){
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({firstName, lastName})
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})
export const UserModel =mongoose.models.User || mongoose.model("User", userSchema);

