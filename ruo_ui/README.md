## Install

1. Fisrt
```bash
  yarn add @upyun/ruo-ui
```

2. Second
```js
const doc = require('@upyun/ruo-ui')
const apiPath = '/doc' // when visit http://localhost:2124/doc, will load api doc ui
app.use(doc(apiPath, ruo.api.definition))
```

## Publish

run 

```
./bin/release
```

## 多文档集

一个应用，需要展示多份不同的文档集时，只需区分不同的文档集访问路径即可。

例如：

```js
const doc = require('@upyun/ruo-ui')
const apiPath = '/doc' // when visit http://localhost:2124/doc, will load api doc ui
app.use(doc(apiPath, ruo.api.definition))


const apiPath2 = '/private/doc' // http://localhost:2124/private/doc, will load private api doc
app.use(doc(apiPath2, privateApiDefinition))
```
## Development

compile, watch and start dev server

```bash
  yarn start
```

build production bundle

```bash
  yarn build
```

## 扩展属性

- `x-type` 每个接口通过定义 x-type，来表明其支持的服务类型
  - 类型为数组，支持 `cdn|file|live` 三种，分别表示 CDN、云存储、直播服务
  - 若未设置该字段，表示接口支持所有类型

## FAQ

- 接口如何划分目录？

每个接口都会定义 `tags` 属性，根据其第一个 tag 值，决定所属目录

