const notFound=(req,res,next)=>{
     try {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    throw error;  // Throw the error to trigger the catch block
  } catch (error) {
    next(error);  // Call next with the thrown error
  }
};

const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode=== 200 ? 500 :res.statusCode;
    res.status(statusCode);
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV==="production"?null : err.stack,

    })
};

module.exports={ notFound,errorHandler};