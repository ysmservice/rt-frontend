//! Rocations Main

import { replaceLanguage } from "../js/language.js";
import { escapeHtml } from "../js/utils.js";


window.onload = function() {
    replaceLanguage();

    var page = (new URLSearchParams(window.location.search)).get("page");
    if (page === null) page = 0;
    let pageItems = document.getElementById("page-items");
    let list = document.getElementById("guilds");
    let loading = document.getElementById("loading");


    let update = function (page) {
        loading.hidden = false;
        list.innerHTML = "";

        fetch(new Request(`/rocations/gets/${page}`))
            .then(response => {
                if (response.status == 200) response.json();
                else alert("何かエラーが発生しました。");
            })
            .then(data => {
                data = data.data, listHtml = "";
                data.invite = escapeHtml(data.invite);
                Object.keys(data).forEach(key => {
                    listHtml += `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${escapeHtml(data.name)}</h5>
                            <div class="card-text">${marked.parse(data.description)}</div>
                            <a href="${data.invite}" class="btn btn-primary language ja" hidden>参加する</a>
                            <a href="${data.invite}" class="btn btn-primary language en" hidden>Join</a>
                        </div>
                        <div class="card-footer">ID: ${key}</div>
                    </div>
                    `;
                });
                list.innerHTML = listHtml;

                // Pageを更新する。
                pageItems.innerHTML = "";
                for (var i = page - 5; i < page + 5; i++)
                    pageItems.innerHTML += `
                    <li class="page-item"><a class="page-link" href="./?page=${i}">${i}</a></li>
                    `;

                loading.hidden = true;
            });
    };
};