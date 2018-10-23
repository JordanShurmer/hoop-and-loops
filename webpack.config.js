const path = require('path');

module.exports = {
    entry: {
        admin: './admin.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    },
    externals: {
        jquery: 'jQuery',
        'firebase/app': 'firebase'
    }
};
