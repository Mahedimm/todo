const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
    env: {
        PUBLIC_URL: ""
    }
});
