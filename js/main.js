import api_url from "./config"

$(() => {
    import js_file from location.pathname != "/dashboard.html" ? "./homepage" : "./dashboard"
    js_file.main(api_url || location.origin, (new URL(location)).searchParams)
})
