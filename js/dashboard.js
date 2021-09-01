BASE_URL = "http://localhost";


var parameters = {};
var parameter_url = location.search.substring(1).split("&");
for (par of parameter_url) {
    parameters[par.split("=")[0]] = par.split("=")[1];
};


function return_commands(data) {
    var command_list = [];
    for (command_name in data) {
        var command = data[command_name];
        for (item_name in command["items"]) {
            var item = command["items"][item_name];
            switch (item["item_type"]) {
                case "text":
                    if (item["text"]["multiple_line"]) {
                        command_list.push(`
                            <b>${command_name}</b>
                            <div>${command["description"]}</div>
                            <label>
                                <div>${item["display_name"]}</div>
                                <input type="text" value="${item["text"]["text"]}" name="${command_name}.${item_name}">
                            </label>
                        `);
                    } else {
                        command_list.push(`
                            <b>${command_name}</b>
                            <div>${command["description"]}</div>
                            <label>
                                <div>${item["display_name"]}</div>
                                <textarea type="text" name="${command_name}.${item_name}" rows="3">${item["text"]["text"]}</textarea>
                            </label>
                        `);
                    };
                    break;

                case "check":
                    command_list.push(`
                        <b>${command_name}</b>
                        <div>${command["description"]}</div>
                        <label>
                            <div>${item["display_name"]}</div>
                            <input type="checkbox" name="${command_name}.${item_name}" value="true" ${item["check"]["checked"] ? "checked" : ""}>
                        </label>
                    `);
                    break;

                case "radios":
                    var radio_list = [];
                    for (radio in item["radios"]) {
                        radio_list.push(`
                            <input type="radio" name="${command_name}.${item_name}" value="${radio}" ${item["radios"][radio] ? "checked" : ""}>
                            ${radio}
                        `);
                    };
                    command_list.push(`
                        <b>${command_name}</b>
                        <div>${command["description"]}</div>
                        <label>
                            <div>${item["display_name"]}</div>
                            <span>${radio_list.join("")}</span>
                        </label>
                    `);
                    break;

                case "list":
                    var i = 0;
                    var option_list = [];
                    for (option in item["list"]["texts"]) {
                        option_list.push(`
                            <option value="${option}" ${item["list"]["index"] == i ? "checked" : ""}>${item["list"]["texts"][option]}</option>
                        `);
                        i++;
                    };
                    command_list.push(`
                        <b>${command_name}</b>
                        <div>${command["description"]}</div>
                        <label>
                            <div>${item["display_name"]}</div>
                            <select name="${command_name}.${item_name}">
                                ${option_list.push("")}
                            </select>
                        </label>
                    `);
                    break;
            };
        };
    };
    return command_list;
};


$(function () {
    $.ajax({
        url: `${BASE_URL}/account/`,
        type: "get",
        dataType: "json"
    }).done(function (data) {
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
        $.ajax({
            url: `${BASE_URL}/account/`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            $(".main").html(`
                <div class="page-main">
                    <img src="${data["icon_url"]}">
                    <div class="hello">
                        <h1>Hello, ${data["user_name"]}!</h1>
                        <div class="logo">
                            <img src="img/icon.png">
                            <div>
                                RT Dashboard
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    } else {
        switch (parameters["p"]) {
            case "server":
                $(`.sidebar .menu .item[data-p="server"]`).addClass("select");
                $.ajax({
                    url: `${BASE_URL}/api/settings/guild`,
                    type: "get",
                    dataType: "json"
                }).done(function (data) {
                    if (!("id" in parameters)) {
                        var server_list = [];
                        for (server in data["settings"]) {
                            server_list.push(`
                                <a href="/dashboard.html?p=server&id=${server}" class="item">
                                    <img src="${data["settings"][server]["icon"] ? data["settings"][server]["icon"] : "img/discord.png"}">
                                    <div>${data["settings"][server]["name"]}</div>
                                </a>
                            `);
                        };
                        $(".main").html(`
                            <div class="page-server">
                                <h1>サーバー > サーバー選択</h1>
                                <div class="server-list">${server_list.join("")}</div>
                            </div>
                        `);
                    } else {
                        if (!(parameters["id"] in data["settings"])) {
                            location.href = "/dashboard.html?p=server";
                        } else {
                            $(".main").html(`
                                <div class="page-server">
                                    <h1>サーバー > ${data["settings"][parameters["id"]]["name"]} > 設定</h1>
                                    <form action="${BASE_URL}/api/settings/update/guild/${parameters["id"]}" method="POST">
                                        <div class="setting">
                                            ${return_commands(data["settings"][parameters["id"]]["commands"]).join("")}
                                            <b class="update">
                                                設定を変更したら保存してください:
                                                <div>
                                                    <button type="reset">リセット</button>
                                                    <button type="submit">保存</button>
                                                </div>
                                            </b>
                                        </div>
                                    </form>
                                </div>
                            `);
                        };
                    };
                });
                break;

            case "user":
                $(`.sidebar .menu .item[data-p="user"]`).addClass("select");
                $.ajax({
                    url: `${BASE_URL}/api/settings/user`,
                    type: "get",
                    dataType: "json"
                }).done(function (data) {
                    $(".main").html(`
                        <div class="page-user">
                            <h1>ユーザー > 設定</h1>
                            <form action="${BASE_URL}/api/settings/update/user" method="POST">
                                <div class="setting">
                                    ${return_commands(data["settings"]).join("")}
                                    <b class="update">
                                        設定を変更したら保存してください:
                                        <div>
                                            <button type="reset">リセット</button>
                                            <button type="submit">保存</button>
                                        </div>
                                    </b>
                                </div>
                            </form>
                        </div>
                    `);
                });
                break;

            case "logout":
                $(`.sidebar .menu .item[data-p="logout"]`).addClass("select");
                $(".main").html(`
                    <h1>Discordからログアウト</h1>
                    <div>Discordからログアウトしますか？<br>再度ダッシュボードを使うにはログインする必要があります。</div>
                    <a href="${BASE_URL}/account/logout/" class="btn">ログアウト</a>
                    <a href="/dashboard.html" class="btn btn-dark">戻る</a>
                `);
                break;

            case "login":
                $(".main").html(`
                    <h1>Discordでログイン</h1>
                    <div>Discordを使ってログインしますか？<br>ログインをするとRTの設定などがWebで行えるようになります。</div>
                    <a href="${BASE_URL}/account/login/" class="btn">ログイン</a>
                    <a href="/" class="btn btn-dark">戻る</a>
                `);
                break;

            default:
                location.href = "/dashboard.html";
        };
    };
});
