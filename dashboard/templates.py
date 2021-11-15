# RT.Dashboard - Templates

from browser import html


def get_help(title, href, description):
    return html.H1(title + html.A(
        html.I(
            Class="bi bi-question-square-fill"
        ), Class="help", href=href, target="_blank"
    )) + description + html.BR() + html.BR()


def _wrap_input(*args, default_input=html.INPUT, **kwargs):
    if "Class" not in kwargs:
        kwargs["Class"] = "form-control"
    kwargs["id"] = "item"
    return default_input(*args, **kwargs)


def _get_form(name, type_, default, big):
    if isinstance(type_, list):
        # セレクター
        return (
            html.SELECT(
                (_wrap_input(
                    word, value=name, default_input=html.OPTION,
                    **({"selected": "selected"} if default == word else {})
                ) for word in type_),
                Class="form-select"
            )
        )
    elif type_ == "str" or big:
        # 文字列入力欄
        return _wrap_input(
            default_input=html.TEXTAREA,
            name=name, value=default, cols=100, rows=10
        ) if big else _wrap_input(
            name=name, value=default, type="text"
        )
    elif type_ in ("int", "float"):
        # 数字入力
        return _wrap_input(name=name, value=default, type="number")
    elif type_ == "bool":
        # チェックボックス
        return html.DIV(
            _wrap_input(
                name, name=name, checked=default, type="checkbox",
                Class="form-check-input"
            ) + html.LABEL(name, Class="form-check-label"), Class="form-check"
        )
    else:
        # それ以外は文字列入力
        return _wrap_input(name=name, value=default, type="text")


def get_form(name, type_, default, big):
    return html.H4(name) + _get_form(name, type_, default, big) + html.BR()