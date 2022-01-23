// RT Dashboard - Utils


/**
 * ログインが必要と表示してからホーム画面にリダイレクトさせます。
 */
function requireLogin() {
    alert("ログインをしてください。");
    window.location = "/";
};


/**
 * 渡されたレスポンスがOKかどうかをチェックしたりする。
 */
export function checkResponse(response) {
    if (response.status == 200)
        return true;
    else if (response.status == 403)
        requireLogin();
    else if (response.status == 503)
        alert("まだRTは準備中です。\nもうちょっと待ってね。");
    else
        alert("データの取得に失敗しました。");
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
export function makeSelect(list, func, message, id) {
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
export function getText(data, user) {
    return get(data, user.language, data.ja);
};