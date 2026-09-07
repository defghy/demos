# Vercel User Registry

与 `platforms/demo-serverless-tencent` 功能一致的用户信息管理页面，使用 Vite + React + Vercel Functions 实现。

## Fields

- `userId` -> `users.user_id` (`integer`)
- `userName` -> `users.user_name` (`text`)
- `age` -> `users.age` (`integer`)

## API contract

- `GET /api/getUserInfo` -> `getUserInfo()`
- `PATCH /api/updateUserInfo` -> `updateUserInfo({ userId, userName, age })`

没有 `POSTGRES_URL` 时，Functions 使用进程内种子数据，便于本机体验；进程重启后修改会丢失。连接 Vercel Postgres 后数据持久化。
Serverless 实例也可能在扩缩容时重置无数据库模式，因此对比演示若需要稳定写入，请配置数据库。

## Local development

```bash
npm install
npm run dev
```

打开 Vite 输出的 `http://127.0.0.1:5173`。需要先执行 `npx vercel login`，因为本地 API 由 `vercel dev` 运行。

## Deploy

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

如果使用 Vercel Postgres / Neon，在项目数据库设置中连接后，将 `POSTGRES_URL` 暴露给部署环境，并用任意 SQL 控制台执行 `db/users.sql`。部署完成后可以在 Vercel Dashboard 查看生产地址。

当前生产地址：<https://demo-serverless-vercel.vercel.app>
