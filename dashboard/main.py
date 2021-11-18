# RT - Dashboard

from browser import document, alert, html, ajax
from json import dumps

from dashboard import templates


# ホーム画面じゃない場合はダッシュボードの説明を削除する。
if "category" in document.query:
    del document["default"]
    category = document.query["category"]
else:
    exit()


# アイコンと名前を設定する。
def on_load_user(request):
    global user
    user = request.json["data"]
    alert(user)
    if user["login"]:
        document["user"] <= html.IMG(src=user["icon"])
        document["user"] <= html.DIV(user["user_name"])
    else:
        alert("ログインをしてください。")


ajax.get("/api/account", True, mode="json", oncomplete=on_load_user)


# 設定画面本編
def on_posted(request):
    data = request.json
    if data["status"] == 200:
        data = data["data"]
        alert(data)
    else:
        alert(f"エラーが発生しました。：{data['message']}")


def on_post(event):
    # 更新ボタンのイベントハンドラ
    global user
    data = {
        "command": event.target.id,
        "kwargs": {},
        "guild_id": guild["id"] if guild else 0,
        "channel_id": 0,
        "user_id": user["id"],
        "category": category
    }
    form = document[f"form-{event.target.id}"]
    # チャンネル指定があった場合は取り出しておく。
    try:
        for option in form.select("#require_channel"):
            if option.selected:
                data["channel_id"] = int(option.value)
                break
        else:
            data["channel_id"] = 0
    except KeyError:
        pass
    # 設定項目に設定されている値を取り出す。
    for item in form.select("#item"):
        if isinstance(item, html.OPTION):
            if item.selected:
                data["kwargs"][item.value] = item.text
        elif item.type == "checkbox":
            data["kwargs"][item.name] = item.value == "on"
        elif item.type == "number":
            if item.value:
                try:
                    data["kwargs"][item.name] = float(item.value)
                except ValueError:
                    return alert(f"エラー：{item.name}は整数または小数点入りの普通の数である必要があります。")
            else:
                data["kwargs"][item.name] = 0.0
        else:
            data["kwargs"][item.name] = item.value
    # POSTする。
    ajax.post(
        "/api/settings/update", data=dumps(data), oncomplete=on_posted,
        headers={'Content-Type': 'application/json'}
    )


def get_guild(guild_id):
    for guild in guilds:
        if str(guild["id"]) == guild_id:
            return guild


def loading(toggle):
    if toggle:
        document["main"] <= html.H1("Now loading...", id="loading")
    else:
        del document["loading"]


def on_load_data(request):
    # 設定項目を組み立てます。
    loading(False)
    datas = request.json["data"]
    if not datas:
        return alert("設定の項目のリストの取得に失敗しました。\nFailed to get settings data.")
    global guild
    if category == "guild" and (guild := get_guild(document.query["guild_id"])) is None:
        return alert("サーバーの情報の取得に失敗しました。")
    elif category != "guild":
        guild = 0

    # 入力フォームを組み立てる。
    for name, data in list(datas.items()):
        headding = data.get("headding", {})
        if headding is None:
            headding = {}
        document["main"] <= templates.get_help(
            data["display_name"], data["help"], headding.get(
                user["language"], headding.get("ja", "...")
            )
        )

        form = html.FORM(id=f"form-{name}")
        # 別途チャンネル指定が必要な場合はチャンネルセレクターを作る。
        if data["require_channel"]:
            select = html.SELECT(Class="form-select")
            before = False

            # ここですごい遠回りなsortedしてるけどそうしないとBrythonでバグが発生する。
            # だから気色悪くても気にしないでね。
            channels = sorted(
                f"{int(channel['voice'])}{channel['name']}-{channel['id']}"
                for channel in guild["channels"]
            )
            for tentative in channels:
                for channel in guild["channels"]:
                    if tentative.endswith(str(channel["id"])):
                        if channel["voice"] is not before:
                            before = True
                            select <= html.OPTION(
                                f"ーーーここからボイスチャンネル"
                            )
                        select <= html.OPTION(
                            channel["name"], value=channel["id"], id="require_channel"
                        )
                        break
            form <= html.H4("チャンネル") + select
        # 設定項目をつなげる。
        for key, (type_, default, big) in data["kwargs"].items():
            form <= templates.get_form(key, type_, default, big)
        button = html.A("OK", Class="rtbtn", id=name)
        button.bind("click", on_post)
        form <= button + html.BR()
        document["main"] <= form

        document["main"] <= html.BR()


def on_recieved_guild(request):
    global guilds
    guilds = request.json["data"]
loading(True)
ajax.get(f"/api/settings/guilds", blocking=True, oncomplete=on_recieved_guild)


if category != "guild" or (category == "guild" and "guild_id" in document.query):
    ajax.get(f"/api/settings/commands/get/{category}", oncomplete=on_load_data)
elif category == "guild":
    # サーバーが選択されていないのならサーバー選択画面にする。
    loading(False)
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
                guild['name'], href=f"/dashboard?category=guild&guild_id={guild['id']}",
                style={"font-size": "23px"}
            )
        )