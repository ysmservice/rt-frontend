import api_url from "./config.js"

$(() => {
    import(location.pathname != "/dashboard.html" ? "./homepage.js" : "./dashboard.js").then(module => {
        module.main(api_url || location.origin, (new URL(location)).searchParams)
    })
})