export const globalErrorHandling = (error,req,res,next)=>{
    return res.status(error.cause?.status ?? 500).json({
        cause: error.cause?.extra,
        error_message : error.message || "server error",
        stack : error.stack,
        error
    })
}