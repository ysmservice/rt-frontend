import api_url from "./config.js"

$(() => {
    import js_file from location.pathname != "/dashboard.html" ? "./homepage.js" : "./dashboard.js"
    js_file.main(api_url || location.origin, (new URL(location)).searchParams)
})
