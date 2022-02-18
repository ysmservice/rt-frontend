
import { replaceLanguage } from "./language.js";
import { api_url } from "./config.js";


$(() => {
    replaceLanguage();
    import(location.pathname != "/dashboard.html" ? "./homepage.js" : "./dashboard.js").then(module => {
        module.main(api_url || location.origin, (new URL(location)).searchParams)
    })
})