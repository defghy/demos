# Socket Demo

1. 使用 `websocket` 替代 `polling`，后者握手时使用多个http请求很难打到同一个worker上面(https://github.com/Unitech/pm2/issues/1510);
2. 不同的用户连接到不同的socket server进程，如何同时给不同socket server推送消息，暂用redis;

## install
1. 安装redis(https://www.cnblogs.com/taojietaoge/p/11010704.html)
2. npm install

## dev

```
npm run dev

// demo html:
http://localhost:8713/demo.html

// push api
// get test
curl http://localhost:8713/api/io/sendMessage?userId=1&platform=kf // user 1
curl http://localhost:8713/api/io/sendMessage?userId=2&platform=kf // user 2
curl http://localhost:8713/api/io/sendMessage?platform=kf  // all kf
// post
curl 'http://localhost:8713/api/io/sendMessage' -H 'Content-Type: application/json;charset=UTF-8' --data-binary '{"platform":"kf","users":[1],"message":"Hello World!!"}'
```

## dev pm2
```
1. 启动redis(redis-server)
2. npm run start
其他同dev
```

## API

### /api/io/sendMessage

参数

```
{
  platform: 'kf',   // 必填 平台代码
  users: ['11233'], // 非必填 不填写时代表整个平台推送
  message: '',  // 必填 推送消息 String|Object
}
```

返回

```
// success
{
  ret: 1,
  data: `消息发送成功`
}
// fail
{
  ret: 100,
  msg: 'platform不能为空'
}
```
