const path = require('path');

module.exports = {
  entry: './src/index.js', // Update this with the entry point of your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
  },
  // Add other configuration options as needed
};
