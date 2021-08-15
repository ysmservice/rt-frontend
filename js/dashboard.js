BASE_URL = "http://tasuren.f5.si:5500";

var parameters = {};
var parameter_url = location.search.substring(1).split("&");
for (par in parameter_url) {
    var par2 = parameter_url[par].split("=");
    parameters[par2[0]] = par2[1];
};

$(function () {
    $.ajax({
        url: `${BASE_URL}/account/`,
        type: "get",
        dataType: "json"
    }).done(function (data) {
        console.log(data);
        if (data["login"]) {
            if (parameters["p"] == "login") {
                location.href = "/dashboard.html";
            };
            $("header div img").attr("src", data["icon_url"]);
            $("header div div").text(data["user_name"]);
        } else if (parameters["p"] != "login") {
            location.href = "?p=login";
        };
    });

    if (!("p" in parameters)) {
        $(`.sidebar .menu .item[data-p="home"]`).addClass("select");
        $(".main").html("<h1>Comming Soon...</h1>");
    } else if (parameters["p"] == "server") {
        $(`.sidebar .menu .item[data-p="server"]`).addClass("select");
        $.ajax({
            url: `${BASE_URL}/api/settings/guild`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            if (!("id" in parameters)) {
                var server_list = [];
                for (server in data["setting"]) {
                    server_list.push(`
                        <a href="/dashboard.html?p=server&id=${server}" title="${data["setting"][server]["name"]}">
                            <img src="${data["setting"][server]["icon"]}"></img>
                        </a>
                    `);
                };
                $(".main").html(`
                    <h1>サーバー設定 > サーバー選択</h1>
                    <div>${server_list.join("")}</div>
                `);
            } else {
                if (!(parameters["id"] in data["setting"])) {
                    location.href = "/dashboard.html?p=server";
                } else {
                    for (command in data["setting"][parameters["id"]]["commands"]) {

                    };
                    $(".main").html(`
                        <h1>サーバー設定 > 設定</h1>

                    `);
                };
            };
        });
    } else if (parameters["p"] == "user") {
        $(`.sidebar .menu .item[data-p="user"]`).addClass("select");
        $(".main").html("<h1>Comming Soon...</h1>");
    } else if (parameters["p"] == "logout") {
        $(`.sidebar .menu .item[data-p="logout"]`).addClass("select");
        $(".main").html(`
            <h1>Discordからログアウト</h1>
            <div>Discordからログアウトしますか？<br>再度ダッシュボードを使うにはログインする必要があります。</div>
            <a href="${BASE_URL}/account/logout/" target="_brank" class="btn">ログアウト</a><a href="/dashboard.html" class="btn btn-dark">戻る</a>
        `);
    } else if (parameters["p"] == "login") {
        $(".main").html(`
            <h1>Discordでログイン</h1>
            <div>Discordを使ってログインしますか？<br>ログインをするとRTの設定などがWebで行えるようになります。</div>
            <a href="${BASE_URL}/account/login/" target="_brank" class="btn">ログイン</a><a href="/" class="btn btn-dark">戻る</a>
        `);
    } else {
        location.href = "/dashboard.html";
    };
});
