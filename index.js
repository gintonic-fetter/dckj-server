'use strict';

const { Application } = require('egg');

const app = new Application({
    mode: 'single',
});

app.listen(7001, '127.0.0.1', () => {
    console.log('server start on http://127.0.0.1:7001');
});
