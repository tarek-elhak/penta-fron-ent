const path = require("path");
const webpack = require("webpack");
module.exports = {
    entry: {
        index: "./src/index.js",
        authentication: "./src/authentication.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname,"dist"),
    },
    mode: "development",
    plugins: [
        new webpack.ProvidePlugin({
           $: "jquery"
        }),
    ],
    watch: true
};