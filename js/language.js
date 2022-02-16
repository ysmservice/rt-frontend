//! 多言語対応用JS


window.onload = function() {
    // 日本語と英語の言語置き換えをする。
    var lang = (navigator.language) ? navigator.language : navigator.userLanguage;
    if (lang === undefined) lang = "ja";

    // 言語の表示切り替えを行う。
    for (let element of document.getElementsByClassName("language")) {
        element.classList.forEach(value => {
            if (lang.indexOf(value) !== -1) {
                element.hidden = false;
            };
        });
    };

    // もし言語が当てはまらなく表示できなかったものがあれば英語版を表示しておく。
    var before;
    for (let element of document.getElementsByClassName("language")) {
        if (typeof before !== "undefined")
            if (before.classList.contains("ja") && element.classList.contains("en")
                    && before.hidden && element.hidden)
                element.hidden = false;
        before = element;
    };
};