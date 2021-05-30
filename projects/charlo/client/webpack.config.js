const createExpoWebpackConfigAsync = require('@expo/vector-icons');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    config.node = {
        fs: 'empty',
        net: 'empty',
        child_process: 'empty',
        readline: 'empty'
    };
    
    return config;
}