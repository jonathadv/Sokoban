module.exports = {
  context: __dirname + "/sokoban",
  entry: {
    javascript: "./app.jsx.js",
    html: "./index.html"
  },

  output: {
    filename: "app.jsx.js",
    path: __dirname + "/dist",
    
  },


  module: {
    loaders: [
    {
       test: /\.js$/,
       exclude: /node_modules/,
       loaders: ["react-hot", "babel-loader"],
    },
    {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
    }
    ],
  }


}
