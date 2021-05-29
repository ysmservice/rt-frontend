# RT-Web

## ファイルについて
### `main.html` (ファイル)
ヘッダーやフッターなどベースになるファイル。

**💡 動かす前に**

① L13~L15のところで`css/ファイル名.min.css`を読み込むようにする。
```html
    <!-- ここで css/ファイル名.min.css を読み込み
    <link rel="stylesheet" href="css/ファイル名.min.css">
    -->
```

② L36~L47のところをログインしていない場合はログインボタン、ログインしている場合はメニューが表示されるようにする。
```html
                <!-- ログインしていない場合 -->
                <a href="https://rt-bot.com/dashboard/login" class="m login">ログイン</a>
                <!-- ログインしている場合 
                <span class="m account">
                    <a href="https://rt-bot.com/dashboard" class="name">Takkun#1643</a>
                    <div class="dropdown">
                        <a href="https://rt-bot.com/dashboard/server">サーバー設定</a>
                        <a href="https://rt-bot.com/dashboard/user">ユーザー設定</a>
                        <a href="https://rt-bot.com/dashboard/logout">ログアウト</a>
                    </div>
                </span>
                -->
```

③ L52のところにコンテンツを埋め込む
```html
    <!-- ここに埋め込む -->
```

### `css` (フォルダー)
基本的に`***.min.css`だけを本番環境にぶち込めばいい。

`***.min.css`の形にしているのは読み込みを速くするため。

### `img` (フォルダー)
すべて本番環境にぶち込む。

## TODO
### 今から
・RT紹介動画を作る

・`index.html`を作る

・`news.html`を作る

・`help.html`(`help/index.html`)を作る

・`help/bot.html`を作る

・`help/server-tool.html`を作る

・`help/server-panel.html`を作る

・`help/server-safety.html`を作る

・`help/server-useful.html`を作る

・`help/individual.html`を作る

・`help/entertainment.html`を作る

・`help/chplugin.html`を作る

・`help/mybot.html`を作る

・`help/other.html`を作る

・`credit.html`を作る

・`status.html`を作る

・`dashboard.html`(`dashboard/index.html`)を作る

・`dashboard/server.html`を作る

・`dashboard/user.html`を作る

・`dashboard/login.html`を作る

・`dashboard/logout.html`を作る

・本番環境に移行する

### 完了
・`main.html`を作る

・`main.min.css`を作る
