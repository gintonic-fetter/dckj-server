/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1580023918527_7761';

    // add your user config here
    const userConfig = {
    // myAppName: 'egg',
    };

    config.security = {
        csrf: false,
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    };

    // 配置需要的中间件，数组顺序即为中间件的加载顺序
    config.middleware = [ 'checkLogin' ];

    // 配置 checkLogin 中间件的配置
    config.checkLogin = {
    // 设置需要忽略检查的路径，支持正则
        ignore: [ /\/login$/, /\/score$/, '/project/list', '/user/rolelist' ],
    };

    // 参数校验
    config.validate = {
        // convert: true,
        // widelyUndefined: true,
    };

    // jwt
    config.jwt = {
        secret: config.keys,
        sign: {
            // 过期时间24小时
            expiresIn: '24h',
        },
    };

    config.cluster = {
        listen: {
            path: '',
            port: 80,
            hostname: '0.0.0.0',
        },
    };

    return {
        ...config,
        ...userConfig,
    };
};
