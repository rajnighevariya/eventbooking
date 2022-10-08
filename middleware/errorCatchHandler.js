module.exports = (err, req, res, next) => {

    err.message = err.message || 'Somthing Went Wrong From Internal Server.';
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}