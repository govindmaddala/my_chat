exports.PathNotFound = (req, res, next) => {
    const error = new Error(`Path ${req.originalUrl} is not found`)
    res.status(404)
    next(error)
}