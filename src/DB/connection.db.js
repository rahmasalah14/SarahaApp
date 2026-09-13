import mongoose from "mongoose"
import { DB_URI } from "../config.js"
import { UserModel } from "./model/user.model.js"
export const bootstrapDB = async (app, PORT) =>{
    try{

        await mongoose.connect(DB_URI)
        await UserModel.syncIndexes() // to create indexes in the database
        console.log(`DB Connected Successfully on ${PORT}`);
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch(error)
    {
        console.error(`Error connecting to DB: ${error.message}`);
    }
}