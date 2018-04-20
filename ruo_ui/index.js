const serve = require('serve-static')
const fs = require('fs')
const path = require('path')
let served = false;

module.exports = function(prefix, apiDefinition) {
    prefix = prefix.endsWith('/') ? prefix.slice(0, prefix.length - 1) : prefix
    const html = prefix.replace(/\//g, '_')
    const filePath = path.join(__dirname, './build/index.html')
    const newPath = path.join(__dirname, `./build/${html}.html`)
    const specPath = '/spec'
    if (!fs.existsSync(newPath)) {
        const old = fs.readFileSync(filePath, 'utf8')
        const newHtml = old.replace(/src="(.*?)"/g, function(m, p) {
            if (p.indexOf(prefix) === 0) {
                return `src="${p}"`
            }
            return `src="${prefix}${p}"`
        }).replace(/href="(.*?)"/g, function(m, p) {
            if (p.indexOf(prefix) === 0) {
                return `href="${p}"`
            }
            return `href="${prefix}${p}"`
        }).replace('%SPEC_PATH%', prefix + specPath)
        .replace('%DOC_PATH%', prefix)

        fs.writeFileSync(newPath, newHtml)
    }

    if (!served) {
        served = serve(path.join(__dirname, './build'))
    }
    function mid(req, res, next) {
        const url = req.url;
        if (!url.startsWith(prefix)) {
            return next();
        }
        
        if (url === prefix + specPath) {
            res.json(apiDefinition)
        } else {
            req.baseUrl = prefix;
            ['path', 'url'].forEach((key) => {
                if (req[key].length === prefix.length) {
                    req[key] = '/'
                } else {
                    req[key] = req[key].slice(prefix.length)
                }
                // NOTE: 不同文档首页不同
                if (req[key] === '/') {
                    req[key] = `/${html}.html`
                }
            })

            served(req, res, next)
        }
    }
    return mid;
}
