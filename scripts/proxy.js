/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-23 00:04:24
 * @Description: Coding something
 */
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const url = require('url');

const port = 10101;
// 1.创建代理服务
http.createServer(onRequest).listen(port);
// http://localhost:10101/?target=https%3A%2F%2Fgithub.com%2Fjoin

console.log('success');
function onRequest (req, res) {
    console.log(req);
    const originUrl = url.parse(req.url);
    const qs = querystring.parse(originUrl.query);
    const targetUrl = qs['target'];
    const target = url.parse(targetUrl);

    const options = {
        hostname: target.hostname,
        port: 80,
        path: url.format(target),
        method: 'GET'
    };
    console.log(options);

    // 2.代发请求
    const proxy = https.request(options, _res => {
        console.log(res);
        // 3.修改响应头
        const fieldsToRemove = [ 'x-frame-options', 'content-security-policy' ];
        Object.keys(_res.headers).forEach(field => {
            if (!fieldsToRemove.includes(field.toLocaleLowerCase())) {
                res.setHeader(field, _res.headers[field]);
            }
        });
        _res.pipe(res, {
            end: true
        });
    });
    req.pipe(proxy, {
        end: true
    });
}