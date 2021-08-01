BASE_URL = "http://localhost:5000";

var parameters = {};
var parameter_url = location.search.substring(1).split("&");
for (par in parameter_url) {
    var par2 = parameter_url[par].split("=");
    parameters[par2[0]] = par2[1];
};

$(function () {
    // ヘッダーのログインボタン
    $.ajax({
        url: `${BASE_URL}/account/`,
        type: "get",
        dataType: "json"
    }).done(function (data) {
        if (data["login"]) {
            $("header .menu .menu-list .login").css("display", "none");
            $("header .menu .menu-list .account .name").text(data["user_name"]);
            $("header .menu .menu-list .account").css("cssText", "display: inline!important;");
        };
    });

    // news.html
    if (location.pathname == "/news.html" && !("p" in parameters)) {
        $.ajax({
            url: `${BASE_URL}/news/`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            delete data["status"];
            for (n in data) {
                $(".news-html").prepend(`<a href="/news.html?p=${n}" class="item"><div>${data[n][0]}</div><div>${data[n][1]}</div></a>`);
            };
        });
    } else if (location.pathname == "/news.html" && "p" in parameters) {
        $.ajax({
            url: `${BASE_URL}/news/${parameters["p"]}/`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            if (data["status"] != "ok") {
                $(".news-html").css("text-align", "center")
                    .html(`<h1>404 Not Found.</h1><div>お探しのページが見つかりませんでした。<br>たどったリンクが正しいか確認してください。</div><a href="/news.html" class="btn">一覧に戻る</a>`);
            } else {
                $(".title").replaceWith(`<div class="title"><h2>ニュース</h2><h1>${data["title"]}</h1><h3>${data["date"]}</h3></div>`);
                $(".news-html").html(marked(data["content"]));
                hljs.highlightAll();
            };
        });
    };

    // help.html
    if (location.pathname == "/help.html" && !("g" in parameters) && !("c" in parameters)) {
        $(".help-html").html(`<a href="/help.html?g=bot" class="item">Bot関連</a><a href="/help.html?g=server-tool" class="item">サーバー(ツール)</a><a href="/help.html?g=server-panel" class="item">サーバー(パネル)</a><a href="/help.html?g=server-safety" class="item">サーバー(安全)</a><a href="/help.html?g=server-useful" class="item">サーバー(便利)</a><a href="/help.html?g=individual" class="item">個人</a><a href="/help.html?g=entertainment" class="item">娯楽</a><a href="/help.html?g=chplugin" class="item">チャンネルプラグイン</a><a href="/help.html?g=mybot" class="item">MyBot</a><a href="/help.html?g=other" class="item">その他</a>`);
    } else if (location.pathname == "/help.html" && "g" in parameters && !("c" in parameters)) {
        $.ajax({
            url: `${BASE_URL}/help/${parameters["g"]}/`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            if (data["status"] != "ok") {
                $(".help-html").css("text-align", "center")
                    .html(`<h1>404 Not Found.</h1><div>お探しのページが見つかりませんでした。<br>たどったリンクが正しいか確認してください。</div><a href="/help.html" class="btn">一覧に戻る</a>`);
            } else {
                $(".title").replaceWith(`<div class="title"><h2>ヘルプ</h2><h1>${data["title"]}</h1></div>`);
                delete data["status"];
                delete data["title"];
                for (n in data) {
                    $(".help-html").append(`<a href="/help.html?g=${parameters["g"]}&c=${data[n][0]}" class="item description" data-description="${data[n][1]}">${data[n][0]}</a>`);
                };
            };
        });
    } else if (location.pathname == "/help.html" && "g" in parameters && "c" in parameters) {
        $.ajax({
            url: `${BASE_URL}/help/${parameters["g"]}/${parameters["c"]}/`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            if (data["status"] != "ok") {
                $(".help-html").css("text-align", "center")
                    .html(`<h1>404 Not Found.</h1><div>お探しのページが見つかりませんでした。<br>たどったリンクが正しいか確認してください。</div><a href="/help.html" class="btn">一覧に戻る</a>`);
            } else {
                $(".title").replaceWith(`<div class="title"><h2>ヘルプ > ${data["g-title"]}</h2><h1>${parameters["c"]}</h1></div>`);
                $(".help-html").html(marked(data["content"]));
                hljs.highlightAll();
            };
        });
    };

    // status.html
    if (location.pathname == "/status.html") {
        $.ajax({
            url: `${BASE_URL}/status/`,
            type: "get",
            dataType: "json"
        }).done(function (data) {
            new Chart("chart-ping", {
                type: "line",
                data: {
                    labels: data["labels"],
                    datasets: [{
                        label: "Ping (ms)",
                        data: data["ping"],
                        borderColor: "#1abc9c",
                        backgroundColor: "#1abc9c80"
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Ping"
                        }
                    }
                }
            });
            new Chart("chart-discord", {
                type: "line",
                data: {
                    labels: data["labels"],
                    datasets: [{
                        label: "サーバー数",
                        data: data["server"],
                        borderColor: "#2ecc71",
                        backgroundColor: "#2ecc7180",
                        yAxisID: "server"
                    },
                    {
                        label: "ユーザー数",
                        data: data["user"],
                        borderColor: "#3498db",
                        backgroundColor: "#3498db80",
                        yAxisID: "user"
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "サーバー数・ユーザー数"
                        }
                    },
                    scales: {
                        server: {
                            type: "linear",
                            display: true,
                            position: "left",
                        },
                        user: {
                            type: "linear",
                            display: true,
                            position: "right",
                        }
                    }
                }
            });
            new Chart("chart-server", {
                type: "line",
                data: {
                    labels: data["labels"],
                    datasets: [{
                        label: "メモリ (%)",
                        data: data["memory"],
                        borderColor: "#9b59b6",
                        backgroundColor: "#9b59b680"
                    },
                    {
                        label: "CPU (%)",
                        data: data["cpu"],
                        borderColor: "#e91e63",
                        backgroundColor: "#e91e6380"
                    },
                    {
                        label: "ディスク (%)",
                        data: data["disk"],
                        borderColor: "#f1c40f",
                        backgroundColor: "#f1c40f80"

                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "メモリ・CPU・ディスク使用率"
                        }
                    }
                }
            });
        });
    };
});

