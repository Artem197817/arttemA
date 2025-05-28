const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '.dist'),
        },
        compress: true,
        port: 9005,
        historyApiFallback: true,
    },
    plugins: [new HtmlWebpackPlugin({
        template: './index.html'
    }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
               // { from: "./src/templates/pages", to: "templates" },
                { from: "./src/css", to: "css" },
                { from: "./src/components/jquery.ripples.js", to: "js" },
                //{ from: "./src/components/carousel.js", to: "js" },
                // { from: "./node_modules/admin-lte/plugins/fontawesome-free/css/all.css", to: "css" },
                // { from: "./node_modules/admin-lte/dist/css/adminlte.min.css", to: "css" },
                // { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css" },
                // { from: "./node_modules/admin-lte//plugins/icheck-bootstrap/icheck-bootstrap.min.css", to: "css" },
                { from: "./node_modules/swiper/swiper-bundle.min.js", to: "js" },
                { from: "./node_modules/jquery/dist/jquery.min.js", to: "js" },
                //{ from: "./", to: "js" },
                { from: "./src/static/fonts", to: "fonts" },
                { from: "./src/static/images", to: "images" },
             ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            implementation: require("less"),
                            // Здесь можно добавить дополнительные опции less, если нужно
                            // lessOptions: { strictMath: true, ... }
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    
};