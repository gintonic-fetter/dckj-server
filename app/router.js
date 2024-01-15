'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/login', controller.user.index);
    router.post('/register', controller.user.register);
    router.get('/rolelist', controller.user.rolelist);
    router.get('/qrcode', controller.qrcode.get);
    router.get('/qrcode/generate', controller.qrcode.generate);
    router.get('/qrcode/total', controller.qrcode.total);
    router.get('/score', controller.stu.getById);
    router.post('/score/update', controller.stu.updateById);
    router.get('/project/list', controller.project.list);
    router.get('/score/export', controller.stu.export);
};
