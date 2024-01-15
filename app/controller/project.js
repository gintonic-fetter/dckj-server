'use strict';

const BaseController = require('./BaseController');

class ProjectController extends BaseController {
    async list() {
        const { ctx } = this;
        const projectList = await ctx.service.project.list();
        if (projectList) {
            ctx.success(projectList);
        } else {
            ctx.msg('查询不到项目列表');
        }
    }
}

module.exports = ProjectController;
