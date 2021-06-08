from flask import *
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/account/")
def account():
    return jsonify({
        "status": "ok",
        "login": True,
        "user_name": "Takkun#1643"
    })


@app.route("/news/")
def news():
    return jsonify({
        "status": "ok",
        "1": ["サンプル①", "2021/06/05"],
        "2": ["サンプル②", "2021/06/06"],
        "3": ["サンプル③", "2021/06/07"]
    })


@app.route("/news/<int:news_number>/")
def news2(news_number):
    return jsonify({
        "status": "ok",
        "title": "Newsのテスト",
        "date": "2021/06/07",
        "content": """
        あいうえお<br>
        かきくけこ<br>
        さしすせそ<br>
        たちつてと<br>
        なにぬねの<br>
        はひふへほ<br>
        まみむめも<br>
        や　ゆ　よ<br>
        らりるれろ<br>
        わ　を　ん<br>
        """
    })


@app.route("/help/<group_name>/")
def help(group_name):
    return jsonify({
        "status": "ok",
        "title": "Bot関連",
        "1": ["help", "Botのヘルプコマンド"],
        "2": ["info", "Botの情報を表示"]
    })


@app.route("/help/<group_name>/<command_name>/")
def help2(group_name, command_name):
    return jsonify({
        "status": "ok",
        "g-title": "Bot関連",
        "content": """
        ヘルプコマンド<br>
        その名の通りのコマンド<br>

        rt!help<br>
        コマンドリストを表示します。<br>

        rt!help &lt;コマンド名&gt;<br>
        <コマンド名>のコマンドの詳細を表示します。<br>

        rt!help search &lt;言葉&gt;<br>
        <言葉>でヘルプを検索します。<br>
        　searchはsで省略可<br>
        """
    })


app.run(debug=True)
