//! Rocations Main

import { replaceLanguage, ISJA, getText } from "../js/language.js";
import { escapeHtml } from "../js/utils.js";


/** レビューカードを作ります。 */
function makeReview(nice) {
    return `
    <div class="card">
        <div class="card-body">
            <div class="d-flex ">
                <div>
                    <img src="${nice.user.avatar}" class="img-thumbnail" alt="ユーザーのアイコン ｜ User Avatar" width="50" height="50" />
                </div>
                <div class="ms-3">
                    <h5>${escapeHtml(nice.user.name)}</h5>
                    <div class="card-text">${marked.parse(escapeHtml(nice.message))}</div>
                </div>
            </div>
        </div>
    </div>
    `;
};


/** Nice送信ボタンが押された際に実行される関数です。 */
function onNice(guildId, count) {
    if (count.indexOf("+") !== -1) return alert(getText({
        ja: "これ以上Niceできません。", en: "Sorry, I can't accept any more Nice."
    }));
    let textarea = document.getElementById(`review-${guildId}`);
    if (textarea.value.length > 2000)
        if (ISJA) alert("二千文字以内にしてください。");
        else alert("It should be no more than 2,000 words.");
    else {
        fetch(new Request(
            `/api/rocations/nice/${guildId}`, {
                method: 'POST',
                header: {"Content-Type": "text/plain"},
                body: textarea.value
            }
        ))
            .then(response => { return response.json(); })
            .then(data => {
                if (data.status < 400) {
                    let reviews = document.getElementById(`reviews-${guildId}`);
                    reviews.innerHTML = "レビューが更新されたようです。すみませんが、再読み込みしてください。";
                    alert("送信しました。");
                } else if (data.status == 403) alert(getText({ja: "ログインをしてください。", en: "You must be logged in."}));
                else if (data.status == 400) alert(getText({ja: "あなたは既にNiceをしています。", en: "You have already done nice."}))
                else alert(`すみませんが何故かNiceが届きませんでした。\nSorry something went wrong.\nCode: ${data.message}`);
            });
    };
};
window.onNice = onNice;


window.onload = function() {
    replaceLanguage();
    if (ISJA) moment.locale("ja");
    else moment.locale("en");

    // クエリパラメータの処理をする。
    let searchParams = new URLSearchParams(window.location.search);
    var page = searchParams.get("page"), extendQuery = "";
    if (page === null) page = 1;
    let search = searchParams.get("search");
    var tags = null;
    if (search) {
        if (search.startsWith("tags:")) {
            tags = search.slice(5); search = null;
        } else extendQuery += "&search=" + search;
    };
    if (tags === null) {
        tags = searchParams.get("tags");
        if (tags !== null) extendQuery += "&tags=" + tags;
    };

    if (search || tags){
        let extras = document.getElementById("extras");
        extras.innerHTML = '<br><div class="alert alert-primary language en" role="alert" hidden> \
        The search results are currently displayed here.<br>If you want to go to first page, click <a href="/rocations">here</a> \
        </div><div class="alert alert-primary language ja" role="alert" hidden> \
        現在検索結果を表示しています。<br>最初の画面に戻りたい場合は<a href="/rocations">こちら</a>をクリックしてください。 \
        </div>';
        for (let element of document.getElementsByClassName('search'))
            element.value = search || `tags:${tags}`;
    };

    // 下準備をする。
    marked.setOptions({breaks: true});
    let pageItems = document.getElementById("page-items");
    let list = document.getElementById("guilds");
    let loading = document.getElementById("loading");

    // ページを更新する。
    loading.hidden = false;
    list.innerHTML = "";

    let request = (query) => {
        fetch(new Request(`/api/rocations/gets${query}${extendQuery}`))
            .then(response => { return response.json(); })
            .then(data => {
                if (data.status != 200) return alert(`何かエラーが発生しました。\nCode: ${data.message}`);
                // サーバー一覧を作る。
                data = data.data;
                if (Object.keys(data).length == 0) {
                    // もし空ならブラウザバックする。
                    if (window.confirm(getText({
                        ja: "検索結果が空でした。\n戻りますか？", en: "The search results were empty.\nDo you want to return?"
                    }))) history.back();
                };
                Object.keys(data).forEach(key => {
                    data[key].invite = escapeHtml(data[key].invite);
                    if (data[key].niceCount >= 100) data[key].niceCount = "100+";
                    list.innerHTML += `<div class="col">
                        <div class="card">
                            <div class="card-header">
                                <div class="d-flex align-items-center">
                                    <div>
                                        <img src="${data[key].icon || '/UNDEFINED'}" class="img-thumbnail" alt="サーバーアイコン ｜ Server Icon" width="64" height="64" />
                                    </div>
                                    <div class="ms-3">
                                        <h5>${escapeHtml(data[key].name)}</h5>
                                        <h6 class="card-subtitle">
                                            ${data[key].tags.map(tag => {
                                                tag = escapeHtml(tag);
                                                return `<a class="badge bg-secondary" href="${`?tags=${tag}`}">${tag}</a>`;
                                            }).join(" ")}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <!-- Description -->
                                <div class="card-text">
                                    <div class="scroll-box">
                                        ${marked.parse(escapeHtml(data[key].description))}
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="row justify-content-between row-cols-1 row-cols-xl-2">
                                    <!-- サーバーIDとlastRaise -->
                                    <div class="col-auto align-items-center  py-1 text-muted">
                                        ID: <code>${key}</code><br>
                                        Last raise: ${moment.unix(data[key].raised).fromNow()}
                                    </div>
                                    <div class="col d-flex justify-content-around align-items-center">
                                        <!-- いいね達 -->
                                        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#nices-${key}">
                                            <i class="bi bi-star"></i> ${data[key].niceCount} Nices
                                        </button>
                                        <div class="modal fade" id="nices-${key}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="nicesLabel-${key}" aria-hidden="true">
                                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="nicesLabel-${key}">Nices</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body" id="reviews-${key}">
                                                        ${
                                                            data[key].reviews.length == 0 ? "まだレビューはないみたい..." :
                                                            data[key].reviews.map(makeReview).join(" ")
                                                        }
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                                                        <!-- Send nice -->
                                                        <button type="button" class="btn btn-warning language ja" data-bs-toggle="modal" data-bs-target="#sendNice-${key}" hidden>
                                                            <i class="bi bi-star"></i> Nice
                                                        </button>
                                                        <button type="button" class="btn btn-warning language en" data-bs-toggle="modal" data-bs-target="#sendNice-${key}" hidden>
                                                            <i class="bi bi-star"></i> Send
                                                        </button>
                                                        <div class="modal fade" id="sendNice-${key}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="sendNiceLabel-${key}" aria-hidden="true">
                                                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                                                <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h5 class="modal-title" id="sendNiceLabel-${key}">Send nice</h5>
                                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        <div class="mb-3">
                                                                            <label for="review" class="form-label language ja" hidden>レビュー (省略可)</label>
                                                                            <label for="review" class="form-label language en" hidden>Review (optional)</label>
                                                                            <textarea class="form-control" id="review-${key}" rows="3"></textarea>
                                                                        </div>
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <div class="language ja" hidden>
                                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                                                                            <button type="button" class="btn btn-primary sendReview-${key}" onclick="window.onNice('${key}', '${data[key].niceCount}');" data-bs-dismiss="modal">送信</button>
                                                                        </div>
                                                                        <div class="language en" hidden>
                                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                            <button type="button" class="btn btn-primary sendReview-${key}" onclick="window.onNice('${key}', '${data[key].niceCount}');" data-bs-dismiss="modal">Send</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="${data[key].invite}" class="btn btn-primary float-end language ja" hidden><i class="bi bi-door-open"></i> 参加する</a>
                                        <a href="${data[key].invite}" class="btn btn-primary float-end language en" hidden><i class="bi bi-door-open"></i> Join</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                });

                // Pageを更新する。
                pageItems.innerHTML = `
                <li class="page-item">
                    <a class="page-link" href="?page=${page - 1}${extendQuery}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;
                for (var i = page - 3; i < page + 3; i++)
                    if (i > 0) pageItems.innerHTML += `
                        <li class="page-item${page == i ? " active" : ""}">
                            <a class="page-link" href="?page=${i}${extendQuery}">${i}</a>
                        </li>
                    `;
                pageItems.innerHTML += `
                <li class="page-item">
                <a class="page-link" href="?page=${page + 1}${extendQuery}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>`;

                loading.hidden = true;
                replaceLanguage();
            });
    };

    request(`?page=${page}`);
};
