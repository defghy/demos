# CloudBase User Registry

用户信息管理页面，使用 CloudBase PostgreSQL 保存并更新用户数据。

## Fields

- `userId` -> `public.users.user_id` (`integer`)
- `userName` -> `public.users.user_name` (`text`)
- `age` -> `public.users.age` (`integer`)

## API contract

The frontend service layer exposes:

- `GET /getUserInfo` -> `getUserInfo()`
- `PATCH /updateUserInfo` -> `updateUserInfo({ userId, userName, age })`

For this minimal CRUD app, these are service contracts backed directly by
CloudBase PG `app.rdb()`. No cloud function is required for the requested
read/update behavior.

## Local development

```bash
npm install
npm run dev
```

The target environment is `web-test-d7gu937080b583504` in `ap-shanghai`.

## CloudBase resources

- PostgreSQL table: `public.users`
- Migration: `cloudbase/migrations/20260904063941_create_users.sql`
- RLS: `anon` and `authenticated` can read/update all rows for this demo
- Static hosting: CloudBase Apps deployment
- Service: `user-registry`
- Version: `user-registry-001`
- URL: https://user-registry-web-test-d7gu937080b583504.webapps.tcloudbase.com/

The demo intentionally allows anonymous read/update because no login requirement
was provided. For production use, replace the broad policies with an authenticated
admin/editor permission model.
