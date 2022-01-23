// RT Dashboard

import { checkResponse } from './utils.js';


// 各JavaScriptを実行する。
window.onload = function() {
    let user, request = new Request("/api/account", {method: "GET"});
    fetch(request)
        .then(response => {
            if (checkResponse(response)) {
                return response.json();
            };
        })
        .then(data => {
            user = data.data;
            if (user.login) {
                document.getElementById("user").innerHTML = `
                    <IMG src=${user.icon} \\>
                    <DIV>${user.user_name}</DIV>
                `;
            };
            if (window.location.pathname.endsWith("setting.html")) {
                import("/dashboard/setting.js").then(module => {
                    module.main_function(user);
                });
            } else {
                document.getElementById("main-loading").hidden = true;
            };
        });
};