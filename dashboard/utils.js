// RT Dashboard - Utils


/**
 * ログインが必要と表示してからログイン画面にリダイレクトさせます。
 */
function requireLogin() {
    alert("ログインをしてください。");
    window.location = "../api/account/login";
};


/**
 * 渡されたレスポンスがOKかどうかをチェックしたりする。
 */
export function checkResponse(response) {
    if (response.status == 200)
        return true;
    else if (response.status == 403)
        requireLogin();
    else if (response.status == 503) {
        alert("りつちゃんは起きたばっかりで寝ぼけてます。(要するに準備中です。)\nもうちょっと待ってね。");
        window.location = "/dashboard";
    } else
        alert("りつちゃんは今風邪をひいているみたいです。\nすみませんが、今はここは使えません。");
    return false;
}


/**
 * HTMLをエスケープします。
 */
export function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};


/**
 * 渡された連想配列をソートします。
 */
export function sort(keys, data, value=true) {
    if (value) {
        return keys.sort((a, b) => {
            if (data[a].codePointAt(0) < data[b].codePointAt(0)) return -1;
            if (data[a].codePointAt(0) > data[b].codePointAt(0)) return 1;
            return 0;
        });
    } else {
        return keys.sort((a, b) => {
            if (a.codePointAt(0) < b.codePointAt(0)) return -1;
            if (a.codePointAt(0) > b.codePointAt(0)) return 1;
            return 0;
        });
    };
};


/**
 * selectを使ったセレクトメニューを作成します。
 */
export function makeSelect(list, func, message, id, class_=null) {
    let div = document.createElement("div");
    div.setAttribute("id", `${id}-menu`);
    let select = document.createElement("select");
    select.setAttribute("class", "form-select");
    select.onchange = func;

    let option;
    // デフォルトを設定する。
    option = document.createElement("option");
    option.selected = true;
    option.setAttribute("value", "...");
    option.textContent = `${message}を選択してください。`;
    select.appendChild(option);
    // リストにあるものをソートしてから追加する。
    sort(Object.keys(list), list).map(id => {
        option = document.createElement("option");
        option.setAttribute("value", id);
        option.textContent = list[id];
        select.appendChild(option);
    });

    select.setAttribute("id", id);
    if (!(class_ === null)) div.classList.add(class_);
    div.appendChild(select);
    return div;
};


/**
 * ただ渡された要素にBRを指定された数だけ追加するだけ。
 */
export function addBr(element, count=1) {
    for (let i = 0; i < count; i++)
        element.appendChild(document.createElement("br"));
    return element;
};


/**
 * 連想配列から何か取得するかなければデフォルトを返します。
 */
export function get(data, key, defaultValue) {
    if (typeof data[key] === "undefined") return defaultValue;
    else return data[key];
};


/**
 * 渡された連想配列から渡されたユーザーデータにのユーザーに相応しい言語の文字列を取り出します。
 */
export function getText(data, user, lang) {
    if (lang == "ja")
        return get(data, user.language, data.ja);
    else return get(data, "en", data.ja)
};


/**
 * ロール等の辞書からオプションのリストを作る。
 */
export function createOptions(data) {
    let options = [], option;
    Object.keys(data).map(key => {
        option = document.createElement("option");
        option.value = key;
        option.innerText = data[key];
        options.push(option);
    });
    return options;
};


const ERRORS = [
    "りつちゃんがこけちゃった！", "りつちゃんがうとうとして集中できなかった！", "りつちゃんがかっこいい人見てたら返信ができなかった！",
    "りつちゃんがコーヒーをこぼしちゃった！", "りつちゃんはリクエストをしました。\nだが、ぴろゆきに絡まれて敗北！"
];
/**
 * エラーメッセージを選びます。
 */
export function getErrorMessage() {
    return ERRORS[Math.floor(Math.random() * ERRORS.length)];
};
