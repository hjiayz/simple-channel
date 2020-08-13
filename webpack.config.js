module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: "./ts/index.ts",
    output: {
        library: 'Channel',
        libraryTarget: 'commonjs',
        filename: "index.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};