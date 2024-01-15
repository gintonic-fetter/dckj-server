'use strict';

const BaseController = require('./BaseController');

class QRCodeController extends BaseController {
    async get() {
        const { ctx } = this;
        const filePath = 'qrcode.zip';
        const data = await ctx.service.stu.zipAll(filePath);
        await ctx.downloadFile(data);
    }

    async generate() {
        const { ctx } = this;
        const num = ctx.query.num;
        if (num) {
            const filePath = 'qrcode.zip';
            const data = await ctx.service.stu.generate(num, filePath);
            await ctx.downloadFile(data);
        }
    }

    async total() {
        const { ctx } = this;
        const total = await ctx.service.stu.total();
        ctx.success(total);
    }
}

module.exports = QRCodeController;
