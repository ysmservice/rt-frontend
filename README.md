# rt-frontend
Free RTという多機能便利なDiscordのBotのフロントエンドであるウェブサイトのリポジトリです。  
テンプレートエンジンに[miko](https://github.com/tasuren/miko)を使用しており、テンプレートである`layout.html`を継承して簡単にウェブページの一つ一つを作成することができます。  
例：
```python
^^ self.layout(
    "タイトル", "説明",
    """<h1>メインコンテンツ</h1>""",
    "オプションで<head>の中身"
) ^^
```

## Contributing
大歓迎です。  
ですが、コードのスタイルを崩さないでください。  
それとコミットメッセージは以下のようにして欲しいです。  
`[new|fix|update|他...]: 変更内容`  
例：`fix: メモリリークを修正した。`
