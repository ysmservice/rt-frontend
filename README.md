# RT-Web
## TODO
* `index.html` の紹介動画のURLを変更する
* `index.html` の紹介文を書き換える
* `credit.html` の紹介文を書き換える
* `status.html` を作る
* `js/main.js` の `BASE_URL` を書き直す

## APIについて
### `/account/`
現在ログインしているアカウントについての情報を返します。

```json
{
  "login": true, // true or false
  "status": "ok", // ok or otherwise
  "user_name": "Takkun#1643" // user name (If the user doesn't log in, This is not the case.)
}
```

## `/news/`
ニュースの一覧を返します。APIとWEBでは表示される順番が逆になることに注意してください。

```json
{
  "1": [
    "サンプル①", // news title
    "2021/06/05" // news date
  ],
  "2": [
    "サンプル②",
    "2021/06/06"
  ],
  "3": [
    "サンプル③",
    "2021/06/07"
  ], 
  "status": "ok" // ok or otherwise
}
```

## `/news/<int:news_number>/`
ニュースの詳細データを返します。

```json
{
  "content": "あいうえお<be>...", // news content (HTML is available.)
  "date": "2021/06/05", // news date
  "status": "ok", // ok or otherwise (If this is not ok, a 404 page will be returned.)
  "title": "サンプル①" // news title
}
```

## `/help/<group_name>/`
ヘルプの一覧を返します。

```json
{
  "1": [
    "help", // command name
    "Botのヘルプコマンド" // A brief description of the command
  ],
  "2": [
    "info",
    "Botの情報を表示"
  ],
  "status": "ok", // ok or otherwise (If this is not ok, a 404 page will be returned.)
  "title": "Bot関連" // group title
}
```

## `/help/<group_name>/<command_name>/`
コマンドの詳細なヘルプ。

```json
{
  "content": "ヘルプコマンド...", // command description
  "g-title": "Bot関連", // group name
  "status": "ok" // ok or otherwise (If this is not ok, a 404 page will be returned.)
}
```
