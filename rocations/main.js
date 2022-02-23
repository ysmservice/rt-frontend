//! Rocations Main

import { replaceLanguage } from "../js/language.js";
import { escapeHtml } from "../js/utils.js";


window.onload = function() {
    replaceLanguage();
    marked.setOptions({breaks: true});

    var page = (new URLSearchParams(window.location.search)).get("page");
    if (page === null) page = 1;
    let pageItems = document.getElementById("page-items");
    let list = document.getElementById("guilds");
    let loading = document.getElementById("loading");

    // ページを更新する。
    loading.hidden = false;
    list.innerHTML = "";

    fetch(new Request(`/rocations/api/gets/${page}`))
        .then(response => {
            if (response.status == 200) return response.json();
            else if (response.status == 404) { alert("このページは存在しないようです。"); history.back() }
            else alert(`何かエラーが発生しました。\nCode: ${response.text()}`);
        })
        .then(data => {
            // サーバー一覧を作る。
            data = data.data;
            Object.keys(data).forEach(key => {
                data[key].invite = escapeHtml(data[key].invite);
                list.innerHTML += `<div class="col">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex">
                            <div class="flex-shrink-0">
                                <img src="${data[key].icon}" class="img-thumbnail" alt="サーバーアイコン ｜ Server Icon" width="64" height="64" />
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h5>${escapeHtml(data[key].name)}</h5>
                                <h6 class="card-subtitle">
                                    ${
                                        data[key].tags.map(tag => {
                                            return `<span class="badge bg-secondary">${tag}</span>`;
                                        }).join(" ")
                                    }
                                    <span class="badge bg-secondary">Secondary</span>
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="card-text">
                            <div class="scroll-box">
                                ${marked.parse(data[key].description)}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="float-start">ID: ${key}</div>
                        <a href="${data[key].invite}" class="btn btn-primary float-end language ja" hidden><i class="bi bi-door-open"></i> 参加する</a>
                        <a href="${data[key].invite}" class="btn btn-primary float-end language en" hidden><i class="bi bi-door-open"></i> Join</a>
                    </div>
                </div>
                </div>`;
            });

            // Pageを更新する。
            pageItems.innerHTML = `
            <li class="page-item">
              <a class="page-link" href="?page=${page - 1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`;
            for (var i = page - 3; i < page + 3; i++)
                if (i > 0) pageItems.innerHTML += `
                    <li class="page-item${page == i ? " active" : ""}">
                        <a class="page-link" href="?page=${i}">${i}</a>
                    </li>
                `;
            pageItems.innerHTML += `
            <li class="page-item">
              <a class="page-link" href="?page=${page + 1}" aria-label="Next"> \
                <span aria-hidden="true">&raquo;</span> \
              </a>
            </li>`;

            loading.hidden = true;
            replaceLanguage();
        });
};