if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "mongodb://admin:V3#10r3n@ds261486.mlab.com:61486/blogapp_prod" }
} else {
    module.exports = { mongoURI: "mongodb://localhost/blogapp" }
}