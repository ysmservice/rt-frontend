// RT Dashboard - Setting

import { checkResponse, makeSelect, addBr, getText, sort, get } from './utils.js';


let mainLoading = document.getElementById("main-loading");
let main = document.getElementById("main");
const DEFAULT_HEADDING = {ja: ""};


export function main_function(user) {
    // メインの関数です。

    let commands = document.getElementById("commands");
    let search = document.getElementById("search");
    let toggleHidden = function () {
        // チャンネルや検索バー等を表示/非表示を切り替えます。
        commands.hidden = !commands.hidden;
        search.hidden = !search.hidden;
    };

    let selectGuild = function () {
        // Guildが指定された際に呼ばれる関数です。
        let channels = document.getElementById("channels-menu");
        if (channels != null) channels.remove();

        if (this.value == "...") {
            toggleHidden();
        } else {
            // Guildからチャンネル情報を取得する。
            mainLoading.hidden = false;
            let request = new Request(`/api/dashboard/get/channels/${this.value}`);
            fetch(request)
                .then(response => {
                    if (response.status == 404)
                        alert("エラー：そのサーバーが見つかりませんでした。");
                    else if (checkResponse(response))
                        return response.json();
                })
                .then(data => {
                    // チャンネルメニューを表示する。
                    main.appendChild(
                        addBr(makeSelect(data.data, toggleHidden, "チャンネル", "channels"))
                    );

                    mainLoading.hidden = true;
                });
        };
    };

    let onSearch = function () {
        // 検索バーがいじられたら表示するコマンドを変更する。
        let items = document.getElementsByClassName("accordion-item");
        for (let index in Array.prototype.slice.call(items)) {
            if (this.value) {
                if (items[index].getAttribute("data-for-search")
                        .indexOf(this.value) != -1)
                    items[index].hidden = false;
                else items[index].hidden = true;
            } else {
                items[index].hidden = false;
            };
        };
    };
    search.oninput = onSearch;

    //コマンドのデータを取得します。
    let request = new Request("/api/dashboard/get/commands")
    fetch(request)
        .then(response => {
            if (checkResponse(response))
                return response.json();
        })
        .then(data => {
            if (data.status == 503) {
                alert("エラー：現在設定データの準備中です。");
            } else {
                data = data.data;
                // サーバーリストを作る。
                main.appendChild(
                    addBr(makeSelect(data.guilds, selectGuild, "サーバー", "guilds"))
                );

                //コマンドリストを作る。
                data = data.data
                let item, id, headding;
                commands.innerHTML = "";
                sort(Object.keys(data), data, false).map(name => {
                    id = `item-${name.replace(" ", "-")}`;
                    headding = getText(get(data[name], "headding", DEFAULT_HEADDING), user);
                    item = document.createElement("div");
                    item.setAttribute("class", "accordion-item");
                    item.setAttribute("data-for-search", `${id}_${headding}`);
                    item.innerHTML = `
                    <h2 class="accordion-header" id="${id}-headding">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-controls="${id}">
                            <strong>rt!${name}</strong>${headding ? "　ー　" : ""}${headding}
                        </button>
                    </h2>
                    <div id="${id}" class="accordion-collapse collapse" aria-labelledby="${id}-headding" data-bs-parent="#commands">
                        <div class="accordion-body">
                            This is the test.
                        </div>
                    </div>
                    `;
                    commands.appendChild(item);
                });

                mainLoading.hidden = true;
            };
        });
};