module.exports = {
    // ... autres configurations
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'source-map-loader',
          enforce: 'pre',
          exclude: /node_modules\/leaflet-geosearch/,
        },
      ],
    },
    // ... autres configurations
  };
  