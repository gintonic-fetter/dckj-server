'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async find(userInfo) {
        const user = await this.app.mysql.get('user', {
            username: userInfo.username,
            password: userInfo.password,
        });
        return user;
    }

    async findByUsername(username) {
        const user = await this.app.mysql.get('user', {
            username,
        });
        return user;
    }

    async findWithRole(userInfo) {
        const userList = await this.app.mysql.query('SELECT * FROM dckj.user as u, dckj.role as r where u.username = ? and u.password = ? and u.role_id = r.id', [
            userInfo.username, userInfo.password,
        ]);
        if (userList) {
            return userList[0];
        }
        return null;
    }

    async rolelist() {
        const roleList = await this.app.mysql.select('role');
        return roleList;
    }

    async insert(userInfo) {
        const existUser = await this.findByUsername(userInfo.username);
        if (existUser) {
            return '该账号已存在';
        }
        const result = await this.app.mysql.insert('user', {
            username: userInfo.username,
            password: userInfo.password,
            nickname: userInfo.nickname,
            role_id: userInfo.roleId,
        });
        const insertSuccess = result.affectedRows === 1;
        if (insertSuccess) {
            return true;
        }
        return '注册失败';


    }


}

module.exports = UserService;
