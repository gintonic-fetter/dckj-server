'use strict';

const BaseController = require('./BaseController');
const ExcelJs = require('exceljs');

class StuController extends BaseController {
    async getById() {
        const { ctx } = this;
        const id = ctx.request.query.id;
        if (id) {
            const stu = await ctx.service.stu.findWithScore(id);
            if (stu) {
                ctx.success(stu);
            } else {
                ctx.msg('没有此学生');
            }
        }
    }

    async updateById() {
        const { ctx } = this;
        const { id, proId } = ctx.request.body;
        if (id && proId) {
            const result = await ctx.service.stu.updateProject(id, proId);
            if (result) {
                ctx.success(result);
            } else {
                ctx.error('加分失败');
            }
        }
    }

    async export() {
        const { ctx } = this;
        const list = await ctx.service.stu.findWithScroeAndPro();
        const blackKeyList = [ 'scoreId', 'pids' ];
        if (list.length) {
            const firstRow = list[0];
            const keys = Object.keys(firstRow);
            const columns = [];
            keys.forEach(key => {
                if (!blackKeyList.includes(key)) {
                    columns.push({
                        header: key,
                        key,
                    });
                }
            });
            const workBook = new ExcelJs.Workbook();
            const workSheet = workBook.addWorksheet('成绩');
            workSheet.columns = columns;
            workSheet.addRows(list);
            const filename = 'score.xlsx';
            const data = await workBook.xlsx.writeBuffer();
            this.ctx.downloadFile(data, filename);
        } else {
            ctx.message('暂无数据');
        }
    }

}

module.exports = StuController;
