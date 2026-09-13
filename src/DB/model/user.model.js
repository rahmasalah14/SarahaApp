import mongoose from "mongoose";
import { GenderEnum } from "../../common/enum/index.js";
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
        required: true,
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

