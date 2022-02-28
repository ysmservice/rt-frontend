//! Status

import { getText } from '/js/language.js';


function addTime(data) {
    var depth = 0; let now = Date.now();
    return data.map(
        count => {
            depth += 1;
            return {t: now - depth * 600, y: count};
        }
    );
};


function makeChart(id, title, datas) {
    let datasets = [], scales = {};
    for (let data of datas) {
        scales[data[4]] = {
            type: "linear",
            display: false,
            position: "right",
        };
        datasets.push({
            label: getText(data[0]), data: addTime(datas[1]),
            borderColor: data[2], backgroundColor: data[3],
            yAxisID: data[4]
        })
    };
    return new Chart(document.getElementById(id).getContext('2d'), {
        type: 'bar',
        data: { datasets: datasets },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: scales
        }
    });
}


fetch(new Request("/api/status"))
    .then(response => { return response.json(); })
    .then(data => {
        if (data.status == 200) {
            data = data.data;
            const myChart = makeChart(
                "chart-discord", "Discord", [
                    [
                        {ja: "サーバー数", en: "Server Count"}, data.guilds,
                        "#2ecc71", "#2ecc7180", "server"
                    ],
                    [
                        {ja: "ユーザー数", en: "User Count"}, data.users,
                        "#3498db", "#3498db80", "user"
                    ],
                    [
                        {ja: "参加中のVC数", en: "Participating VoiceChannels Count"}, data.voicePlaying,
                        "#a2d7dd", "#abced8", "vcs"
                    ]
                ]
            )
        } else alert(`何かエラーが発生してステータスを取得できませんでした。\n${JSON.stringify(data)}`);
    });