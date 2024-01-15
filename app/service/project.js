'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {
    async list() {
        const proList = await this.app.mysql.select('project');
        return proList;
    }
}

module.exports = ProjectService;
