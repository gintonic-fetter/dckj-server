'use strict';

module.exports = {
    success(data) {
        this.body = {
            code: 0,
            data,
        };
    },

    msg(message) {
        this.body = {
            code: 200,
            message,
        };
    },

    error(code = -1, message) {
        this.body = {
            code,
            message: message || 'error',
        };
    },

    login() {
        this.body = {
            code: 401,
            message: 'Login Please',
        };
    },

    forbidden() {
        this.body = {
            code: 403,
            message: 'Login Forbidden',
        };
    },

    async downloadFile(data, filename) {
        this.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${filename}`,
        });
        this.success(data);
    },
};
