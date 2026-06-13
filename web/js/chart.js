/**
 * Chart Manager — Chart.js rendering & theme logic
 */
export class ChartManager {
    constructor() {
        this.chart = null;
        this.convergenceChart = null;
    }

    getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            grid: style.getPropertyValue('--chart-grid').trim(),
            tick: style.getPropertyValue('--chart-tick').trim(),
            legend: style.getPropertyValue('--chart-legend').trim(),
        };
    }

    updateTheme() {
        const colors = this.getThemeColors();
        const updateOptions = (chart) => {
            if (!chart) return;
            chart.options.scales.y.grid.color = colors.grid;
            chart.options.scales.y.ticks.color = colors.tick;
            chart.options.scales.x.grid.color = colors.grid;
            chart.options.scales.x.ticks.color = colors.tick;
            chart.options.plugins.legend.labels.color = colors.legend;
            if (chart.options.scales.x.title) {
                chart.options.scales.x.title.color = colors.tick;
            }
            if (chart.options.scales.y.title) {
                chart.options.scales.y.title.color = colors.tick;
            }
            chart.update('none');
        };
        updateOptions(this.chart);
        updateOptions(this.convergenceChart);
    }

    renderChart(results) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        const labels = results.map(r => r.label);
        const empiricalData = results.map(r => r.empiricalProb);
        const theoreticalData = results.map(r => r.theoreticalProb);
        const theme = this.getThemeColors();

        const toBarBackground = (color, alpha) => {
            if (!color) return `rgba(0, 210, 255, ${alpha})`;
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            return color;
        };

        const barColors = results.map(r => toBarBackground(r.color, 0.65));
        const barBorderColors = results.map(r => r.color || '#00d2ff');
        const barHoverColors = results.map(r => toBarBackground(r.color, 0.85));

        if (this.chart) {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = empiricalData;
            this.chart.data.datasets[0].backgroundColor = barColors;
            this.chart.data.datasets[0].borderColor = barBorderColors;
            this.chart.data.datasets[1].data = theoreticalData;
            this.chart.update('none');
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Thực nghiệm (%)',
                        data: empiricalData,
                        backgroundColor: barColors,
                        borderColor: barBorderColors,
                        hoverBackgroundColor: barHoverColors,
                        borderWidth: 2,
                        borderRadius: 8,
                        order: 2
                    },
                    {
                        label: 'Lý thuyết (%)',
                        data: theoreticalData,
                        type: 'line',
                        borderColor: '#ff007a',
                        borderWidth: 3,
                        pointRadius: 0,
                        fill: false,
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                hover: {
                    mode: 'index',
                    intersect: true
                },
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: theme.grid,
                            drawBorder: false
                        },
                        ticks: {
                            color: theme.tick,
                            font: { size: 12 },
                            callback: (v) => v + '%'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: theme.tick,
                            font: { size: 11 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: theme.legend, font: { family: 'Inter', size: 12 } }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { weight: '700', size: 13 },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: true,
                        callbacks: {
                            label: (context) => {
                                const idx = context.dataIndex;
                                const res = results[idx];
                                if (context.datasetIndex === 0) {
                                    return [
                                        `  Thực nghiệm: ${res.empiricalProb.toFixed(3)}%`,
                                        `  Lý thuyết:   ${res.theoreticalProb.toFixed(3)}%`,
                                        `  Sai số:      ${res.error > 0 ? '+' : ''}${res.error.toFixed(4)}%`
                                    ];
                                }
                                return `  ${res.theoreticalProb.toFixed(3)}%`;
                            }
                        }
                    }
                }
            },
        });
    }

    renderConvergenceChart(history, theoreticalProb) {
        const ctx = document.getElementById('convergenceChart').getContext('2d');
        const theme = this.getThemeColors();

        if (this.convergenceChart) {
            this.convergenceChart.data.datasets[0].data = history;
            this.convergenceChart.data.datasets[1].data = [
                { x: 0, y: theoreticalProb },
                { x: history.length > 0 ? history[history.length - 1].x : 0, y: theoreticalProb }
            ];
            this.convergenceChart.update('none');
            return;
        }

        this.convergenceChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Tần suất lũy tiến (%)',
                        data: history,
                        borderColor: '#00d2ff',
                        borderWidth: 3,
                        backgroundColor: 'rgba(0, 210, 255, 0.08)',
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#00d2ff',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2,
                        fill: false,
                        tension: 0.15
                    },
                    {
                        label: 'Giới hạn lý thuyết',
                        data: [
                            { x: 0, y: theoreticalProb },
                            { x: history[history.length - 1].x, y: theoreticalProb }
                        ],
                        borderColor: '#ff007a',
                        borderWidth: 3,
                        borderDash: [6, 4],
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                hover: {
                    mode: 'nearest',
                    intersect: false
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Số lần thử (n)', color: theme.tick, font: { size: 12 } },
                        grid: {
                            color: theme.grid,
                            drawBorder: false
                        },
                        ticks: { color: theme.tick, font: { size: 11 } }
                    },
                    y: {
                        title: { display: true, text: 'Tỉ lệ (%)', color: theme.tick, font: { size: 12 } },
                        grid: {
                            color: theme.grid,
                            drawBorder: false
                        },
                        ticks: {
                            color: theme.tick,
                            font: { size: 11 },
                            callback: (v) => v.toFixed(1) + '%'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: theme.legend, font: { family: 'Inter', size: 12 } }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { weight: '700', size: 13 },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            title: (items) => 'n = ' + items[0].parsed.x.toLocaleString(),
                            label: (context) => {
                                if (context.datasetIndex === 0) {
                                    return `  Tần suất: ${context.parsed.y.toFixed(3)}%`;
                                }
                                return `  Lý thuyết: ${context.parsed.y.toFixed(3)}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    exportChartPng() {
        if (!this.chart) return;
        const link = document.createElement('a');
        link.download = 'graph4prob-chart.png';
        link.href = this.chart.toBase64Image('image/png', 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    destroyAll() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        if (this.convergenceChart) {
            this.convergenceChart.destroy();
            this.convergenceChart = null;
        }
    }
}
