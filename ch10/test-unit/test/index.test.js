const supertest = require('supertest');
const chai = require('chai');

const app = require('../index');

const expect = chai.expect;
const request = supertest(app.listen());

// 測試套件/組
describe('開始測試demo的GET請求', () => {

    // 測試用例
    it('測試/getString.json請求', (done) => {
        request
            .get('/getString.json')
            .expect(200)
            .end((err, res) => {
                // 斷言判斷結果是否為object類型
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('string');
                done();
            });
    });

    it('測試/getNumber.json請求', (done) => {
        request
            .get('/getNumber.json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('number');
                done();
            });
    });

});

describe('開始測試demo的POST請求', () => {
    it('測試/postData.json請求', (done) => {
        request
            .post('/postData.json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('string');
                done();
            });
    });
});