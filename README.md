# rt-frontend
RTという多機能便利なDiscordのBotのフロントエンドであるウェブサイトのリポジトリです。  
テンプレートエンジンに[miko](https://github.com/tasuren/miko)を使用しており、テンプレートである`layout.html`を継承して簡単にウェブページの一つ一つを作成することができます。  
例：
```python
^^ self.layout(
    "タイトル", "説明",
    """<h1>メインコンテンツ</h1>""",
    "オプションで<head>の中身"
) ^^
```

## Installation
`brython`と言うフォルダにBrythonを用意するのみです。
