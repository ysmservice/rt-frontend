# RT - Dashboard

from browser import window, document, alert, html, ajax
from json import dumps, loads

try:
    import templates
except ImportError:
    pass


# ホーム画面じゃない場合はダッシュボードの説明を削除する。
if "category" in document.query:
    category = document.query["category"]
else:
    exit()


# アイコンと名前を設定する。
def on_load_user(request):
    global user
    user = request.json["data"]
    if user["login"]:
        document["user"] <= html.IMG(src=user["icon"])
        document["user"] <= html.DIV(user["user_name"])
        user["id"] = int(user["icon"].split("/")[4])
    else:
        alert("ログインをしてください。")


ajax.get("/api/account", True, mode="json", oncomplete=on_load_user)


# 設定画面本編
def on_post(event):
    # 更新ボタンのイベントハンドラ
    global user
    data = {
        "command": event.target.id,
        "kwargs": {},
        "guild_id": guild["id"] if guild else 0,
        "user_id": user["id"],
        "category": category
    }
    form = document[f"form-{event.target.id}"]

    # 設定項目に設定されている値を取り出す。
    for item in form.select("#item"):
        if isinstance(item, html.OPTION):
            if item.selected:
                if "name" in item.attrs:
                    key, value = item.attrs["name"], int(item.value)
                else:
                    key, value = item.value, item.text
        elif item.type == "checkbox":
            key, value = item.name, item.checked
        elif item.type == "number":
            if item.value:
                try:
                    key, value = item.name, float(item.value)
                except ValueError:
                    return alert(f"エラー：{item.name}は整数または小数点入りの普通の数である必要があります。")
            else:
                key, value = item.name, 0.0
        else:
            key, value = item.name, item.value

        if value or value is False:
            data["kwargs"][key] = value

    modal_id = event.target.id.replace(" ", "-") + "_modal"

    def on_posted(request):
        data = request.json
        if data["status"] == 200:
            data = data["data"]
            templates.update_modal(
                document, modal_id, data
            )
        else:
            templates.update_modal(
                document, modal_id,
                f"# エラーが発生しました。\n```\n{data['message']}\n```"
            )

    # モーダルのローディングをリセットする。
    templates.show_loading(document, f"loading_{modal_id}", True)
    document[f"main_{modal_id}"].html = ""

    # POSTする。
    ajax.post(
        "/api/settings/update", data=dumps(data), oncomplete=on_posted,
        headers={'Content-Type': 'application/json'}
    )


def get_guild(guild_id):
    for guild in guilds:
        if str(guild["id"]) == guild_id:
            return guild


def on_load_data(request):
    # 設定項目を組み立てます。
    templates.loading_show(document, "main_loading", False)
    datas = request.json["data"]
    if not datas:
        return alert("設定の項目のリストの取得に失敗しました。\nFailed to get settings data.")
    global guild
    if category == "guild" and (guild := get_guild(document.query["guild_id"])) is None:
        return alert("サーバーの情報の取得に失敗しました。")
    elif category != "guild":
        guild = 0

    # 入力フォームを組み立てる。
    container = html.DIV(Class="container")
    count = 0
    row = html.DIV(Class="row g-4")
    for name, data in sorted(datas.items(), key=lambda x: x[0]):
        count += 1

        headding = data.get("headding", {})
        if headding is None:
            headding = {}

        form = html.DIV(id=f"form-{name}")

        # 設定項目をつなげる。
        for key, (type_, default, big) in data["kwargs"].items():
            form <= templates.get_form(key, type_, default, big, guild)
        modal_id = name.replace(" ", "-") + "_modal"
        button = html.A(
            "OK", Class="btn", id=name, **{
                "data-bs-toggle": "modal", "data-bs-target": f"#{modal_id}",
                "aria-hidden": "false"
            }
        )
        button.bind("click", on_post)
        form <= (
            html.BR() + button + templates.modal(
                modal_id, data["display_name"]
            ) + html.BR()
        )

        row <= html.DIV(
            html.DIV(
                html.DIV(
                    html.STRONG(html.FONT(
                        ((html.A(
                            html.I(
                                Class="bi bi-question-square-fill"
                            ), Class="help", href=data["help"], target="_blank"
                        ) + " ") if data["help"] else "")
                        + data["display_name"], size=5.5
                    )),
                    Class="card-header"
                ) + html.DIV(
                    headding.get(
                        user["language"], headding.get("ja", "...")
                    ) + html.BR() + html.BR() + form,
                    Class="card-body"
                ),
                Class="card"
            ),
            Class="col-4"
        )

    container <= row
    document["main"] <= container


def on_recieved_guild(request):
    # サーバー情報を取得したら変数に入れる。
    global guilds
    guilds = request.json["data"]
ajax.get(f"/api/settings/guilds", blocking=True, oncomplete=on_recieved_guild)


# サーバー情報を取得するかサーバー選択にするかです。
if category != "guild" or (category == "guild" and "guild_id" in document.query):
    ajax.get(f"/api/settings/commands/get/{category}", oncomplete=on_load_data)
elif category == "guild":
    # サーバーが選択されていないのならサーバー選択画面にする。
    templates.loading_show(document, "main_loading", False)
    document["main"] <= html.H1("サーバー選択") + "設定を行いたいサーバーを選択してください。" \
        + html.BR() + html.BR()
    before = ""
    for guild in sorted(guilds, key=lambda d: d["name"]):
        if guild["name"][0] != before:
            before = guild["name"][0]
            document["main"] <= html.H2(f"{before}行")
            document["main"] <= html.UL(id=f"guilds-{before}")
        document[f"guilds-{before}"] <= html.LI(
            html.A(
                guild['name'],
                href=f"{window.location.pathname}?category={category}&guild_id={guild['id']}",
                style={"font-size": "23px"}
            )
        )
