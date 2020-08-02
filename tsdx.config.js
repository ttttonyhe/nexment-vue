const sass = require('rollup-plugin-sass');
const vue = require('rollup-plugin-vue');
module.exports = {
    rollup(config, options) {
        config.plugins.push(
            sass({
                insert: true
            }),
            vue()
        );
        return config;
    },
};