const webpack = require("webpack")

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.resolve.fallback = {
        ...config.resolve.fallback,
        os: false,
        https: false,
        http: false,
        crypto: false,
        assert: false,
        zlib: false,
        path: false,
        constants: false,
        domain: false,
        console: false,
        stream: false,
        fs: false,
        buffer: false,
        util: false,
        net: false,
        tls: false,
        perf_hooks: false,
        async_hooks: false,
        child_process: false,
        module: false,
        'ts-node': false,
        url: false
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js", '.tsx']
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    // console.log(config.resolve)
    // console.log(config.plugins)

    return config
}