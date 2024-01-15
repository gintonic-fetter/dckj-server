'use strict';

const Service = require('egg').Service;
const qrImage = require('qr-image');
const JSZip = require('jszip');

class StuService extends Service {
    async find(id) {
        const stu = await this.app.mysql.get('stu', { id });
        return stu;
    }

    async findWithScore(id) {
        const stu = await this.app.mysql.query('SELECT stu.id as id, stu.stu_id as stuId, stu.name as name, score.id as scoreId, score.pids as pids FROM dckj.stu as stu, dckj.score as score where stu.id = ? and stu.score_id = score.id limit 1', [ id ]);
        if (stu) {
            return stu[0];
        }
        return null;
    }

    async findWithScroeAndPro() {
        const proList = await this.service.project.list();
        const proMap = [];
        proList.forEach(item => {
            proMap[item.id] = item;
        });
        const stuList = await this.app.mysql.query('SELECT stu.id as id, stu.stu_id as stuId, stu.name as name, score.id as scoreId, score.pids as pids FROM dckj.stu as stu, dckj.score as score where stu.score_id = score.id');
        stuList.forEach(stu => {
            if (stu.pids) {
                stu.projects = stu.pids.split(',').map(pid => {
                    return proMap[pid].name;
                }).toString();
            } else {
                stu.projects = '';
            }
        });
        return stuList;
    }

    async insert(id, score) {
        await this.app.mysql.insert('stu', {
            id,
            score,
        });
    }

    async update({ id, score }) {
        await this.app.mysql.update('stu', {
            id,
            score,
        });
    }

    async delete(id) {
        await this.app.mysql.delete('stu', id);
    }

    async zipAll() {
        const start = 1;
        const end = await this.getMaxId();
        const result = await this.zip(start, end);
        return result;
    }

    async generate(num) {
        if (typeof num !== 'number') {
            num = Number(num);
        }
        // 插入分数记录
        const scoreRows = [];
        for (let i = 0; i < num; i++) {
            scoreRows.push({});
        }
        const scoreResult = await this.app.mysql.insert('score', scoreRows);
        console.log(scoreResult);
        const scoreIdStart = scoreResult.insertId;
        const scoreIdEnd = scoreIdStart + num;

        // 插入学生记录，并关联分数记录
        const stuRows = [];
        for (let i = scoreIdStart; i < scoreIdEnd; i++) {
            stuRows.push({
                score_id: i,
            });
        }
        const stuResult = await this.app.mysql.insert('stu', stuRows);
        const stuIdStart = stuResult.insertId;
        const stuIdEnd = stuIdStart + num;
        const zipResult = await this.zip(stuIdStart, stuIdEnd);
        return zipResult;
    }

    async zip(start, end) {
        let result;
        const zip = new JSZip();

        for (let i = start; i < end; i++) {
            const filename = `${i}.png`;
            const image = await qrImage.image(`${this.app.config.qrcode.baseUrl}?id=${i}`, { type: 'png' });
            zip.file(filename, image);
        }

        await zip.generateAsync({ type: 'nodebuffer' }).then(content => {
            result = content;
        });
        return result;
    }

    async getMaxId() {
        // 获取当前最大id
        const queryResult = await this.app.mysql.query('SELECT MAX(id) as maxId FROM stu');
        return Number(queryResult[0].maxId) || 0;
    }

    async total() {
        const count = await this.app.mysql.count('stu');
        return count;
    }

    async updateProject(stuId, proId) {
        const pro = await this.app.mysql.get('project', { id: proId });
        if (pro) {
            const stu = await this.findWithScore(stuId);
            if (stu) {
                let pids = stu.pids;
                if (pids && pids.length > 0) {
                    pids += `,${proId}`;
                } else {
                    pids = `${proId}`;
                }
                const updateResult = await this.app.mysql.update('score', {
                    pids,
                }, {
                    where: {
                        id: stu.scoreId,
                    },
                });
                return updateResult;
            }
            return false;

        }

    }


}

module.exports = StuService;
