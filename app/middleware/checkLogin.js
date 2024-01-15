'use strict';
const { isRegExp } = require('../utils/index');


module.exports = (options, app) => {
    return async function checkLogin(ctx, next) {
        // 获取免登录接口地址
        const { ignore } = app.config.checkLogin;
        const { url } = ctx.request;
        console.log({ url });
        let isIgnore = false;
        // 判断是否免登录
        if (Array.isArray(ignore)) {
            isIgnore = ignore.some(ignoreItem => {
                if (isRegExp(ignoreItem)) {
                    return ignoreItem.test(url);
                }
                return ignoreItem === url;

            });
        } else {
            isIgnore = ignore.test(url);
        }

        if (isIgnore) {
            await next();
        } else {
            try {
                // 判断是否登录
                const token = ctx.get('token');
                if (!token) {
                    // 未登录
                    ctx.login();
                    return;
                }
                const userInfo = app.jwt.verify(token, app.config.jwt.secret);
                console.log({ userInfo });
                if (url === '/userInfo') {
                    ctx.success(Object.assign({ token }, userInfo));
                    return;
                }
                await next();
            } catch (error) {
                console.error(error);
                // 登录过期
                ctx.forbidden();
                return;
            }
        }

    };
};
