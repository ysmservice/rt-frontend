// RT Dashboard - Setting

import {
    checkResponse, makeSelect, addBr, getErrorMessage,
    getText, sort, get, createOptions
} from './utils.js';
import { getLanguage } from "/js/language.js";


let mainLoading = document.getElementById("main-loading");
let selectors = document.getElementById("selectors");
const DEFAULT_HEADDING = {ja: ""};


export function main_function(user) {
    // メインの関数です。

    let lang = getLanguage();

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
            let request = new Request(`/api/dashboard/get/datas/${this.value}`);
            fetch(request)
                .then(response => {
                    if (response.status == 404)
                        alert("エラー：そのサーバーが見つかりませんでした。");
                    else if (checkResponse(response))
                        return response.json();
                })
                .then(data => {
                    // チャンネルメニューを表示する。
                    selectors.appendChild(
                        addBr(makeSelect(
                            data.data.channels, function () {
                                if (commands.hidden) { toggleHidden() };
                            }, "チャンネル", "channels", "col"
                        ))
                    );

                    // ロールメニュー等を実装する。
                    let roles = createOptions(data.data.roles), options, type;
                    let channels = createOptions(data.data.channels);
                    let members = createOptions(data.data.members);
                    for (let element of document.getElementsByClassName("form-select")) {
                        if (element.hasAttribute("data-need-options")) {
                            type = element.getAttribute("data-need-options");
                            if (type == "Role") options = roles;
                            else if (type == "Channel") options = channels;
                            else options = members;
                            element.innerHTML = "";
                            for (let option of options)
                                element.appendChild(option.cloneNode(true));
                        };
                    };

                    mainLoading.hidden = true;
                });
        };
    };

    let onSearch = function () {
        // 検索バーがいじられたら表示するコマンドを変更する。
        let items = document.getElementsByClassName("accordion-item"), value = this.value;
        if (value.startsWith("rt!"))
            value = value.replace("rt!", "");
        for (let index in Array.prototype.slice.call(items)) {
            if (value) {
                if (items[index].getAttribute("data-for-search")
                        .indexOf(value) == -1)
                    items[index].hidden = true;
                else items[index].hidden = false;
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
                selectors.appendChild(
                    addBr(makeSelect(data.guilds, selectGuild, "サーバー", "guilds", "col"))
                );

                //コマンドリストを作る。
                data = data.data
                let item, id, headding;
                commands.innerHTML = "";
                sort(Object.keys(data), data, false).map(name => {
                    // 全般準備
                    id = `item-${name.replace(/\s/g, "-")}`;
                    headding = getText(get(data[name], "headding", DEFAULT_HEADDING), user, lang);
                    item = document.createElement("div");
                    item.setAttribute("class", "accordion-item");
                    item.setAttribute("data-for-search", `${name}_${headding}`);
                    // 入力画面を作る。
                    let form = document.createElement("div"), div, input, label;
                    Object.keys(data[name].kwargs).map(key => {
                        div = document.createElement("div");
                        div.classList.add("mb-3");
                        label = document.createElement("label");
                        label.innerText = key;
                        label.classList.add("form-label");
                        div.appendChild(label);
                        // 入力ボックスを作る。
                        if ("intfloatstr".indexOf(data[name].kwargs[key].type) != -1) {
                            if ("intfloat".indexOf(data[name].kwargs[key].type) != -1) {
                                input = document.createElement("input");
                                input.type = "number";
                            } else input = document.createElement("textarea");
                            input.classList.add("form-control");
                            if (!(data[name].kwargs[key].default === null))
                                input.value = data[name].kwargs[key].default;
                        } else {
                            input = document.createElement("select");
                            input.classList.add("form-select");
                            let option;
                            if (data[name].kwargs[key].type == "Literal") {
                                Object.keys(data[name].kwargs[key].extra).map(literalIndex => {
                                    option = document.createElement("option");
                                    option.innerText = data[name].kwargs[key].extra[literalIndex];
                                    option.value = data[name].kwargs[key].extra[literalIndex];
                                    if (data[name].kwargs[key].default == option.value)
                                        option.selected = true;
                                    input.appendChild(option);
                                });
                            } else input.setAttribute(
                                "data-need-options", data[name].kwargs[key].type
                            );
                        };
                        input.setAttribute("name", key)
                        div.appendChild(input);
                        form.appendChild(div);
                    })
                    item.innerHTML = `
                    <h2 class="accordion-header" id="${id}-headding">
                        <button id="${id}-button" data-id="${id}" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-controls="${id}">
                            <strong>rt!${name}</strong>${headding ? "　ー　" : ""}${headding}
                        </button>
                    </h2>
                    <div id="${id}" name="formDiv" class="accordion-collapse collapse" aria-labelledby="${id}-headding" data-bs-parent="#commands">
                        <div class="accordion-body" name="formDivAccordion">
                            <form action="" id="${id}-form" method="post">
                                ${form.innerHTML}
                                <input type="submit" class="btn btn-primary" value="Run" data-bs-toggle="modal" data-bs-target="#staticBackdrop" />
                                <a href="${data[name].help}" target="_blank" class="btn">Help</a>
                            </form>
                        </div>
                    </div>
                    `;

                    commands.appendChild(item);
                    let formBox = document.getElementById(`${id}-form`);
                    let modalLoading = document.getElementById("modal-loading");
                    let modalContent = document.getElementById("modal-content");
                    let formData, body;

                    formBox.onsubmit = function () {
                        modalLoading.hidden = false;
                        modalContent.innerHTML = "";

                        // リクエストを行う。
                        formData = new FormData(formBox), body = {};
                        for (let entry of formData.entries())
                            body[entry[0]] = entry[1];
                        fetch(`/api/dashboard/post/${
                            document.getElementById("guilds").value
                        }/${
                            document.getElementById("channels").value
                        }/${name}`, {
                            method: 'POST',
                            header: {"Content-Type": "application/json"},
                            body: JSON.stringify(body)
                        })
                            .then(response => {
                                modalLoading.hidden = true;
                                if (response.status == 200) return response.json();
                                else if (response.status == 429)
                                    modalContent.innerText = "リクエストが早すぎます。りつちゃんが忙しくなります！";
                                else modalContent.innerText = `${getErrorMessage()}\nエラーコード: ${response.status}`;
                            })
                            .then(data => {
                                if (data) {
                                    if (data.status == 200)
                                        if (data.data[0] == "Ok")
                                            return modalContent.innerHTML = marked.parse(data.data[1]);
                                };
                                if (!(typeof data === "undefined"))
                                    modalContent.innerHTML = `${getErrorMessage()}\nエラーコード: <code>${
                                        JSON.stringify(data)
                                    }</code>`;
                            });
                        return false;
                    };
                });

                mainLoading.hidden = true;
            };
        });
};