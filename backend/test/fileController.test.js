const { expect } = require('chai');
const axios = require('axios');
const controllerFile = require('../src/controller/fileController');
var sinon = require("sinon");
const nock = require('nock')
const { url } = require('../config.json');

try {
    describe('getFiles function', function () {
        it('should return status 200', async function () {
            const files = ['test1.csv', 'test2.csv'];
            const fileData = {
                'test1.csv': `file,text,number,hex
                    test3.csv,KKcCULrSKPYkXeBWe,1460691,4ca0c3d00236b388b98679150aad3ba0`,
                'test2.csv': `file,text,number,hex
                    test2.csv,TJvfe
                    test2.csv,jzPpP,9,505477455c284d56bbf41ed331047175`
            }
            const req = {};
            const res = {
                send: sinon.spy(),
                status: (function (status) {
                    this.status = status
                    return this;
                }),
            };

            nock(url)
                .get('/v1/secret/files')
                .reply(200, { files })

            files.forEach((file) => {
                nock(url)
                    .get(`/v1/secret/file/${file}`)
                    .reply(200, fileData[file]);
            });


            await controllerFile.getFiles(req, res);

            expect(res.send.calledOnce).to.equal(true);
            expect(res.send.args[0][0]).to.deep.equal([
                { file: 'test1.csv', lines: [{ text: 'KKcCULrSKPYkXeBWe', number: '1460691', hex: '4ca0c3d00236b388b98679150aad3ba0' }] },
                { file: 'test2.csv', lines: [{ text: 'jzPpP', number: '9', hex: '505477455c284d56bbf41ed331047175' }] },
            ]);

        })

        it('should handle invalid files', async function () {
            const files = ['test1.csv'];

            const req = {};
            const res = {
                send: sinon.spy(),
                status: (function (status) {
                    this.status = status
                    return this;
                }),
            };

           
            nock(url)
                .get('/v1/secret/files')
                .reply(200, { files });

            nock(url)
                .get(`/v1/secret/file/${files[0]}`)
                .reply(404);

            await controllerFile.getFiles(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.args[0][0]).to.deep.equal([]);
        })

        it('should handle empty files', async function () {
            const files = [];

            nock(url)
                .get('/v1/secret/files')
                .reply(200, { files });

            const req = {};
            const res = {
                send: sinon.spy(),
                status: (function (status) {
                    this.status = status;
                    return this;
                }),
            };

            await controllerFile.getFiles(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.args[0][0]).to.deep.equal([]);
        });

        it('should filter invalid lines', async function () {
            const files = ['test1.csv'];
            const fileData = {
                'test1.csv': 'file,text,number,hex\ntest1.csv,e,037,1234567890abcdef\ntest1.csv, , ,',
            };

            nock(url)
                .get('/v1/secret/files')
                .reply(200, { files });

            nock(url)
                .get(`/v1/secret/file/${files[0]}`)
                .reply(200, fileData[files[0]]);

            const req = {};
            const res = {
                send: sinon.spy(),
                status: (function (status) {
                    this.status = status;
                    return this;
                }),
            };

            await controllerFile.getFiles(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.args[0][0]).to.deep.equal([
                { file: 'test1.csv', lines: [{ text: 'e', number: '037', hex: '1234567890abcdef' }] },
            ]);
        });

        it('should handle error ', async function () {
            const error = new Error('error');
            sinon.stub(axios, 'get').rejects(error);

            const req = {};
            const res = {
                send: sinon.spy(),
                status: (function (status) {
                    this.status = status;
                    return this;
                }),
            };

            await controllerFile.getFiles(req, res);

            expect(res.status).to.equal(500);
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.args[0][0]).to.equal('Internal Server Error');
        });
    });

} catch (error) {
    console.log(error)
}
