/*Not Found Error Handler */

const notFound = (req,res,next)=>{
    const error = new Error(`Route Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Error Handler

const HandlerError = (err,req,res,next)=>{
    const statuscode = res.statusCode ? res.statusCode : 500;
    res.status(statuscode);
    res.json({
        status:false,
        message:err?.message,
        stack:err?.stack,
    });
};

module.exports={HandlerError,notFound};