module.exports = {
    apps: [{
        name: "backend-starter-api",
        script: "./bin/www.js",
        env: {
            NODE_ENVIRONMENT: "production",
            HOST_NAME: "localhost"
        }
    }]
}
