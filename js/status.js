//! Status

import { getText } from '/js/language.js';


function makeChart(id, title, datas) {
    let datasets = [], scales = {};
    let now = Date.now() / 1000;
    let labels = [];
    for (let i = 0; i < datas[0][1].length; i++) {
        labels.push(moment.unix(now - 600 * i).format("MM-DD HH:mm"));
    };
    for (let data of datas) {
        scales[data[4]] = { 
            type: 'linear',
            display: true,
            position: data[5],
            ticks: { color: data[2] }
        };
        datasets.push({
            label: getText(data[0]), data: data[1],
            borderColor: data[2], yAxisID: data[4]
        })
    };
    return new Chart(document.getElementById(id).getContext('2d'), {
        type: 'line',
        data: { datasets: datasets, labels: labels.reverse() },
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
};


fetch(new Request("/api/status"))
    .then(response => { return response.json(); })
    .then(data => {
        if (data.status == 200) {
            data = data.data;
            const discordChart = makeChart(
                "chart-discord", "Discord", [
                    [
                        {ja: "サーバー数", en: "Server Count"}, data.guilds,
                        "#2ecc71", "#2ecc7180", "server", "left"
                    ],
                    [
                        {ja: "ユーザー数", en: "User Count"}, data.users,
                        "#3498db", "#3498db80", "user", "left"
                    ],
                    [
                        {ja: "接続中のVCの数", en: "VCs connected Count"}, data.voicePlaying,
                        "#ffd900", "##ffd90080", "voice", "left"
                    ]
                ]
            );
            const latencyChart = makeChart(
                "chart-latency", getText({ja: "レイテンシ (ping値)", en: "Latency (Ping ms)"}), [
                    [
                        {ja: "Discordとの接続", en: "Discord Connection"}, data.discordLatency,
                        "#2ecc71", "#2ecc7180", "discord", "left"
                    ],
                    [
                        {ja: "Botとバックエンドとの接続", en: "Bot and Backend Connection"}, data.backendLatency,
                        "#3498db", "#3498db80", "backend", "right"
                    ]
                ]
            );
            const botChart = makeChart(
                "chart-bot", "Bot", [
                    [
                        {ja: "CPU使用率", en: "CPU usage"}, data.botCpu,
                        "#2ecc71", "#2ecc7180", "cpu", "left"
                    ],
                    [
                        {ja: "メモリ使用率", en: "Memory usage"}, data.botMemory,
                        "#3498db", "#3498db80", "memory", "left"
                    ],
                    [
                        {ja: "データベース接続プールサイズ", en: "Database Connection Pool Size"}, data.botPoolSize,
                        "#ffd900", "#ffd90080", "pool", "right"
                    ],
                    [
                        {ja: "非同期タスク数", en: "Asynchronous Task Count"}, data.botTaskCount,
                        "#ba2636", "#ba263680", "task", "right"
                    ]
                ]
            );
            const backendChart = makeChart(
                "chart-backend", getText({ja: "バックエンド", en: "Backend"}), [
                    [
                        {ja: "CPU使用率", en: "CPU usage"}, data.backendCpu,
                        "#2ecc71", "#2ecc7180", "cpu", "left"
                    ],
                    [
                        {ja: "メモリ使用率", en: "Memory usage"}, data.backendMemory,
                        "#3498db", "#3498db80", "memory", "left"
                    ],
                    [
                        {ja: "データベース接続プールサイズ", en: "Database Connection Pool Size"}, data.backendPoolSize,
                        "#ffd900", "#ffd90080", "pool", "right"
                    ],
                    [
                        {ja: "非同期タスク数", en: "Asynchronous Task Count"}, data.backendTaskCount,
                        "#ba2636", "#ba263680", "task", "right"
                    ]
                ]
            );
        } else alert(`何かエラーが発生してステータスを取得できませんでした。\n${JSON.stringify(data)}`);
    });