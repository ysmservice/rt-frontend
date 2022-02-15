
import { api_url } from "./config.js"


window.onload = function() {
    // 日本語と英語の言語置き換えをする。
    var lang = (navigator.language) ? navigator.language : navigator.userLanguage;
    if (lang === undefined) lang = "ja";

    for (let element of document.getElementsByClassName("language")) {
        element.classList.forEach(value => {
            if (lang.indexOf(value) !== -1)
                element.hidden = false;
        });
    };
};


$(() => {
    import(location.pathname != "/dashboard.html" ? "./homepage.js" : "./dashboard.js").then(module => {
        module.main(api_url || location.origin, (new URL(location)).searchParams)
    })
})