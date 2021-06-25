const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public')
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader",
              },
              {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
              },
              {
                test: /\.css$/,
                loader: "css-loader",
              },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public')
    }
}