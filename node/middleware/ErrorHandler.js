const ErrorHandle = require("../utilities/ErrorHandle");

exports.ErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Inernal Server Error';

    // return next(new ErrorHandle(err.message, err.statusCode))
    res.status(err.statusCode).json({
        message: err.message,
        stack: err.stack
    })

    //Roadside coder
    // err.statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    // err.message = err.message || 'Inernal Server Error';
    // res.status(err.statusCode).json({
    //     message: err.message,
    //     errorStack: process.env.NODE_ENV === "PROD" ? null : err.stack
    // })
}

