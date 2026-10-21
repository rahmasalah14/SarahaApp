import { BadRequestException } from "../common/exceptions/error.exception";

export const validation = (schema)=>{
    return (req,res,next)=>{
          const validationResult =  schema.safeParse(req.body);
            if(!validationResult.success)
            {
              throw BadRequestException("Validation Error", validationResult.error.issues );
            }
           req.validate = validationResult.data
           next()
    }
}