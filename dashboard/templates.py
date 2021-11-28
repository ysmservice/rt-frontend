# RT.Dashboard - Templates

from browser import html, window


def _wrap_input(*args, default_input=html.INPUT, **kwargs):
    if "Class" not in kwargs:
        kwargs["Class"] = "form-control"
    kwargs["id"] = "item"
    return default_input(*args, **kwargs)


def _get_form(name, type_, default, big, guild):
    if isinstance(type_, list):
        if type_[0] == "Literal":
            # Literal, セレクター
            return html.SELECT(
                (_wrap_input(
                    word, value=name, default_input=html.OPTION,
                    **({"selected": "selected"} if default == word else {})
                ) for word in type_[1:]),
                Class="form-select"
            )
        elif type_[0] == "Union":
            # Union, 複数をもう一度おく。
            return (
                _get_form(name, t, default, big, guild) for t in type_[1:]
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
    elif type_ in ("Member", "Channel", "Role"):
        # メンバーセレクター
        return html.SELECT(
                (_wrap_input(
                    data["name"], value=str(data["id"]), name=name,
                    default_input=html.OPTION
                ) for data in sorted(
                    guild[f"{type_.lower()}s"], key=(
                        (lambda x: ('VC: ' if x["voice"] else 'TC: ') + x["name"])
                        if type_ == "Channel" else lambda x: x["name"]
                    )
                )
            ), Class="form-select"
        )
    else:
        # それ以外は文字列入力
        return _wrap_input(name=name, value=default, type="text")


def get_form(name, type_, default, big, guild):
    return html.H4(name) + _get_form(name, type_, default, big, guild) + html.BR()


def get_loading(**kwargs):
    return html.DIV(
        (
            html.DIV(Class=f"sk-cube sk-cube{i}")
            for i in range(1, 10)
        ),
        Class="sk-cube-grid",
        align="center", **kwargs
    )


def show_loading(document, id_, onoff):
    if onoff:
        if "hidden" in document[id_].attrs:
            del document[id_].attrs["hidden"]
    else:
        document[id_].attrs["hidden"] = "true"


def loading_show(*args, **kwargs):
    return show_loading(*args, **kwargs)


def modal(id_: str, title: str) -> html.DIV:
    return html.DIV(
        html.DIV(
            html.DIV(
                html.DIV(html.H5(title, Class="modal-title"), Class="modal-header")
                + html.DIV(
                    get_loading(id=f"loading_{id_}") + html.DIV(id=f"main_{id_}"),
                    Class="modal-body", id=f"body_{id_}"
                ) + html.DIV(
                    html.BUTTON("Close", Class="btn", **{"data-bs-dismiss": "modal"}),
                    Class="modal-footer"
                ),
                Class="modal-content"
            ),
            Class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        ),
        Class="modal fade", id=id_, tabindex="-1", **{
            "data-bs-backdrop": "static"
        }
    )


def update_modal(document, id_, description, mark=True):
    loading_show(document, f"loading_{id_}", False)
    if mark:
        new = ""
        for line in description.splitlines():
            new += f"{line}{'' if line.startswith(('#', '* ')) else '  '}\n"
        document[f"main_{id_}"].html = window.marked.parse(new)
    else:
        document[f"main_{id_}"].html = description