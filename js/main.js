import { api_url } from "./config.js"

$(() => {
    import(location.pathname != "/dashboard.html" ? "./homepage.js" : "./dashboard.js").then(module => {
        module.main(api_url || location.origin, (new URL(location)).searchParams)
    })
})


window.onload = function() {
    // 日本語と英語の言語置き換えをする。
    var lang = (navigator.language) ? navigator.language : navigator.userLanguage;
    if (lang === undefined) lang = "ja";

    for (let element of document.getElementsByClassName("language")) {    
        if (lang.toLowerCase().indexOf("ja") === -1)
            if (element.classList.contains("ja"))
                element.hidden = false;
        else if (element.classList.contains("en"))
            element.hidden = false;
    };
}