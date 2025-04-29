const webpack = require('webpack');

module.exports = function override(config) {
    const newFallback = {
        ...config.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        process: require.resolve('process/browser'),
    };
    const updatedConfig = {
        ...config,
        resolve: {
            ...config.resolve,
            fallback: newFallback,
        },
        plugins: [
            ...config.plugins,
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
            }),
        ],
    };
    return updatedConfig;
};
