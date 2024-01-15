'use strict';

const BaseController = require('./BaseController');

class UserController extends BaseController {
    async index() {
        const { ctx, config, app } = this;
        const userInfo = ctx.request.body;
        console.log('userInfo', userInfo);
        const validateErrors = app.validator.validate({ username: 'string', password: 'string' }, userInfo);
        if (validateErrors) {
            console.log(validateErrors);
            return ctx.error(null, '参数校验失败');
        }
        const user = await ctx.service.user.findWithRole(userInfo);
        console.log('user', user);
        if (user) {
            const userInfo = {
                role: user.role,
                rolename: user.rolename,
                username: user.username,
                nickname: user.nickname,
            };
            const token = app.jwt.sign(userInfo, config.jwt.secret);
            ctx.set('token', token);
            ctx.success({
                ...userInfo,
                token,
            });
        } else {
            ctx.error(403, '登录失败，请检查账号密码');
        }
    }

    async rolelist() {
        const { ctx } = this;
        const roleList = await ctx.service.user.rolelist();
        if (roleList) {
            ctx.success(roleList);
        } else {
            ctx.msg('查询不到项目列表');
        }
    }

    async register() {
        const { ctx, app } = this;
        const userInfo = ctx.request.body;
        console.log('userInfo', userInfo);
        const validateErrors = app.validator.validate({ username: 'string', password: 'string', roleId: 'integer' }, userInfo);
        if (validateErrors) {
            console.log(validateErrors);
            return ctx.error(null, '参数校验失败');
        }
        const result = await ctx.service.user.insert(userInfo);
        console.log('result', result);
        if (result === true) {
            ctx.success();
        } else {
            ctx.error(1001, result || '注册失败');
        }
    }
}

module.exports = UserController;
