# RT-Web

## ファイルについて
### HTML
ヘッダーやフッターなどベースになるファイル。

**💡 動かす前に**

① `main.html`のL13~L15のところで`css/ファイル名.min.css`を読み込むようにする。
```html
    <!-- ここで css/ファイル名.min.css を読み込み
    <link rel="stylesheet" href="css/ファイル名.min.css">
    -->
```

② `main.html`のL35~L46のところをログインしていない場合はログインボタン、ログインしている場合はメニューが表示されるようにする。
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

③ `main.html`のL51のところにコンテンツを埋め込む。
```html
    <!-- ここに埋め込む -->
```

④ `index.html`のL6~L9を紹介動画のURLにする。
```html
    <!-- RTの紹介動画に変える -->
    <iframe width="480" height="270" src="https://www.youtube.com/embed/9KsZ3Zi6NJg?rel=0" title="YouTube video player"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
```

④ `index.html`のL13~L136の機能紹介のところを書き、写真を貼り付ける。
```html
        <div class="item">
            <p>メッセージ削除</p>
            <p>{{ 説明 }}</p>
            <img src="img/404.png">
            <p>
                <a href="https://rt-bot.com/help/server-tool/delmes">ヘルプを見る</a>
            </p>
        </div>
        <!-- 省略 -->
        <div class="item">
            <p>カスタムBot</p>
            <p>{{ 説明 }}</p>
            <img src="img/404.png">
            <p>
                <a href="https://rt-bot.com/help/mybot">ヘルプを見る</a>
            </p>
        </div>
```

⑤ `news.html`のL5~L13でニュースを一覧で表示する。書き方は以下を参考にする。
```html
    <!-- ここにニュースを埋め込む -->
    <a href="https://rt-bot.com/news/2" class="item">
        <div>テスト②</div>
        <div>2021/06/03</div>
    </a>
    <a href="https://rt-bot.com/news/1" class="item">
        <div>テスト①</div>
        <div>2021/06/03</div>
    </a>
```

⑥ `help.html`のL5~L14に説明を書き込む。
```html
    <a href="https://rt-bot.com/help/bot" class="item" data-description="{{ 説明 }}">Bot関連</a>
    <a href="https://rt-bot.com/help/server-tool" class="item" data-description="{{ 説明 }}">サーバー(ツール)</a>
    <a href="https://rt-bot.com/help/server-panel" class="item" data-description="{{ 説明 }}">サーバー(パネル)</a>
    <a href="https://rt-bot.com/help/server-safety" class="item" data-description="{{ 説明 }}">サーバー(安全)</a>
    <a href="https://rt-bot.com/help/server-useful" class="item" data-description="{{ 説明 }}">サーバー(便利)</a>
    <a href="https://rt-bot.com/help/individual" class="item" data-description="{{ 説明 }}">個人</a>
    <a href="https://rt-bot.com/help/entertainment" class="item" data-description="{{ 説明 }}">娯楽</a>
    <a href="https://rt-bot.com/help/chplugin" class="item" data-description="{{ 説明 }}">チャンネルプラグイン</a>
    <a href="https://rt-bot.com/help/mybot" class="item" data-description="{{ 説明 }}">MyBot</a>
    <a href="https://rt-bot.com/help/other" class="item" data-description="{{ 説明 }}">その他</a>
```

⑦ `credit.html`のL24~L93のプロフィールを書く。
```html
    <!-- 紹介文を書き換える -->
    <h2>tasuren</h2>
    <div class="icon">
        <img src="img/tasuren.png">
        <div>
            <p>
                <span class="group c-1">プログラム班</span>
                <span class="group c-2">Web開発班</span>
            </p>
            僕がRTの開発をし始めた張本人です。<br>
            現在高校一年生です。<br>
            自称クソガキッズですがなるべくクソガキッズではないようにしたいと思っています。
        </div>
    </div>
    <!-- 省略 -->
    <h2>Rice cake</h2>
    <div class="icon">
        <img src="img/ricecake.gif">
        <div>
            <p>
                <span class="group c-3">デザイン班</span>
            </p>
            {{ profile }}
        </div>
    </div>
```

### CSS
基本的に`***.min.css`だけを本番環境にぶち込めばいい。

`***.min.css`の形にしているのは読み込みを速くするため。

### IMG
すべて本番環境にぶち込む。

## TODO
・RT紹介動画を作る

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

・`status.html`を作る

・`dashboard.html`(`dashboard/index.html`)を作る

・`dashboard/server.html`を作る

・`dashboard/user.html`を作る

・`dashboard/login.html`を作る

・`dashboard/logout.html`を作る

・本番環境に移行する
