/**
 * UI Controller for TTK-AI
 */

export class UIController {
    constructor() {
        this.chart = null;
        this.convergenceChart = null;
        this.elements = {
            title: document.getElementById('main-title'),
            desc: document.getElementById('main-description'),
            nInput: document.getElementById('numTrials'),
            runBtn: document.getElementById('runBtn'),
            tableHead: document.getElementById('table-head'),
            tableBody: document.getElementById('table-body'),
            aiSection: document.getElementById('aiSection'),
            aiContent: document.getElementById('aiContent'),
            emptyState: document.getElementById('emptyState'),
            heroSection: document.getElementById('heroSection'),
            summaryGrid: document.getElementById('summaryGrid'),
            skeletonContainer: document.getElementById('skeletonContainer'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            exportChartPng: document.getElementById('exportChartPng'),
            exportTableCsv: document.getElementById('exportTableCsv'),
            tooltipTitle: document.getElementById('tooltipTitle'),
            tooltipDesc: document.getElementById('tooltipDesc'),
            tooltipFormula: document.getElementById('tooltipFormula')
        };

        // Tooltip data for each simulation type
        this.tooltipData = {
            dice: {
                title: '🎲 Xúc xắc (Dice)',
                desc: 'Mô phỏng tung một con xúc xắc 6 mặt cân đối. Luật số lớn: tần suất mỗi mặt sẽ hội tụ về 1/6 ≈ 16.67% khi số lần tung tăng lên.',
                formula: 'P(mỗi mặt) = 1/6 ≈ 16.67%'
            },
            coin: {
                title: '🪙 Đồng xu (Coin)',
                desc: 'Mô phỏng tung một đồng xu cân đối. Khi tung đủ nhiều lần, tỉ lệ mặt Ngửa và mặt Sấp sẽ tiến dần đến 50-50.',
                formula: 'P(Ngửa) = P(Sấp) = 1/2 = 50%'
            },
            card: {
                title: '🃏 Lá bài (Cards)',
                desc: 'Rút ngẫu nhiên một lá từ bộ bài 52 lá tiêu chuẩn. Mỗi chất (Bích, Cơ, Rô, Chuồn) có 13 lá, xác suất rút được mỗi chất là 1/4.',
                formula: 'P(mỗi chất) = 13/52 = 1/4 = 25%'
            },
            urn: {
                title: '🎱 Rút bi (Urn Problem)',
                desc: 'Rút bi từ một túi chứa nhiều màu khác nhau. Có thể chọn chế độ "có hoàn trả" (xác suất không đổi) hoặc "không hoàn trả" (xác suất thay đổi).',
                formula: 'P(màu X) = số bi màu X / tổng số bi'
            },
            monty: {
                title: '🚪 Nghịch lý Monty Hall',
                desc: 'Bạn chọn 1 trong 3 cửa, host mở 1 cửa toé. Chiến thuật tối ưu: LUÔN ĐỔI cửa — xác suất thắng tăng từ 33.33% lên 66.67%!',
                formula: 'P(thắng khi ĐỔI) = 2/3 ≈ 66.67%'
            },
            birthday: {
                title: '🎂 Nghịch lý Ngày sinh (Birthday Paradox)',
                desc: 'Trong một nhóm chỉ 23 người, xác suất có ít nhất 2 người trùng ngày sinh đã > 50%. Với 70 người, xác suất > 99.9%!',
                formula: 'P(có trùng) = 1 - 365! / ((365-n)! × 365ⁿ)'
            },
            buffon: {
                title: '🪡 Kim Buffon (Ước lượng Pi)',
                desc: 'Thả một cây kim có độ dài bằng khoảng cách giữa các đường kẻ song song. Xác suất kim chạm vạch là 2/π ≈ 63.66% — dùng để ước lượng số Pi!',
                formula: 'P(chạm vạch) = 2/π ≈ 63.66% → π ≈ 2n / hits'
            },
            galton: {
                title: '🛝 Bàn Galton (Định lý Giới hạn Trung tâm)',
                desc: 'Các viên bi rơi qua các hàng đinh ngẫu nhiên. Kết quả hội tụ về phân phối Chuẩn (hình chuông) — minh hoạ cho Định lý Giới hạn Trung tâm.',
                formula: 'P(ô k) = C(n,k) × (1/2)ⁿ  →  Xấp xỉ Chuẩn'
            }
        };

        this.setupExportListeners();
        this.setupTooltipListeners();
    }

    showWelcome() {
        this.elements.emptyState.style.display = '';
        this.elements.heroSection.style.display = 'none';
        this.elements.summaryGrid.style.display = 'none';
        this.elements.skeletonContainer.style.display = 'none';
        document.getElementById('chartCard').style.display = 'none';
        document.getElementById('convergenceCard').style.display = 'none';
        document.getElementById('aiSection').style.display = 'none';
        document.getElementById('dynamic-inputs').innerHTML = '';
    }

    updateHeader(type) {
        // Hide empty state, show hero
        this.elements.emptyState.style.display = 'none';
        this.elements.heroSection.style.display = '';

        if (type === 'dice') {
            this.elements.title.textContent = 'Mô phỏng Xúc xắc';
            this.elements.desc.textContent = 'Xác suất lý thuyết cho mỗi mặt của xúc xắc 6 mặt là 1/6 (≈ 16.67%).';
        } else if (type === 'coin') {
            this.elements.title.textContent = 'Mô phỏng Tung đồng xu';
            this.elements.desc.textContent = 'Xác suất lý thuyết cho mỗi mặt của đồng xu cân đối là 1/2 (50%).';
        } else if (type === 'card') {
            this.elements.title.textContent = 'Mô phỏng Rút lá bài';
            this.elements.desc.textContent = 'Xác suất lý thuyết để rút được một chất (Cơ, Rô, Chuồn, Bích) là 1/4 (25%).';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'urn') {
            this.elements.title.textContent = 'Mô phỏng Rút bi có hoàn trả (Urn Problem)';
            this.elements.desc.textContent = 'Xác suất rút được một viên bi phụ thuộc vào số lượng bi của màu đó chia cho tổng số bi trong túi.';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'monty') {
            this.elements.title.textContent = 'Nghịch lý Monty Hall';
            this.elements.desc.textContent = 'Bạn chọn 1 cửa. Host mở 1 cửa Dê. Bạn có nên đổi cửa không? (Luôn luôn ĐỔI có xác suất thắng 66.67%)';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'birthday') {
            this.elements.title.textContent = 'Nghịch lý Ngày sinh (Birthday Paradox)';
            this.elements.desc.textContent = 'Xác suất để trong một nhóm N người có ít nhất 2 người trùng ngày sinh.';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'buffon') {
            this.elements.title.textContent = 'Kim Buffon (Ước lượng số Pi)';
            this.elements.desc.textContent = 'Mô phỏng việc thả một cây kim lên mặt phẳng có các đường kẻ song song để ước lượng giá trị của số π.';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'galton') {
            this.elements.title.textContent = 'Bàn Galton (Định lý Giới hạn Trung tâm)';
            this.elements.desc.textContent = 'Các viên bi rơi qua các hàng đinh ngẫu nhiên sẽ hội tụ về Phân phối Chuẩn (Bell Curve).';
            this.renderDynamicInputs(type);
            return;
        }

        document.getElementById('dynamic-inputs').innerHTML = '';
    }

    renderDynamicInputs(type) {
        const container = document.getElementById('dynamic-inputs');
        if (type === 'card') {
            container.innerHTML = `
                <div class="dyn-group">
                    <label class="dyn-label" style="color: var(--text-muted);">Chế độ rút</label>
                    <select class="dyn-input" id="cardMode" style="width: 250px; height: 48px; padding: 12px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); outline: none; cursor: pointer; font-size: 1rem; color: var(--text-main);">
                        <option value="with" selected>Có hoàn trả (With Replacement)</option>
                        <option value="without">Không hoàn trả (Without Replacement)</option>
                    </select>
                </div>
            `;
        } else if (type === 'urn') {
            container.innerHTML = `
                <div class="dyn-group">
                    <label class="dyn-label" style="color: #ef4444;">🔴 Đỏ</label>
                    <input type="number" class="dyn-input" id="urnRed" value="3" min="0" max="100">
                </div>
                <div class="dyn-group">
                    <label class="dyn-label" style="color: #3b82f6;">🔵 Xanh</label>
                    <input type="number" class="dyn-input" id="urnBlue" value="5" min="0" max="100">
                </div>
                <div class="dyn-group">
                    <label class="dyn-label" style="color: #22c55e;">🟢 Lục</label>
                    <input type="number" class="dyn-input" id="urnGreen" value="2" min="0" max="100">
                </div>
                <div class="dyn-group">
                    <label class="dyn-label" style="color: #eab308;">🟡 Vàng</label>
                    <input type="number" class="dyn-input" id="urnYellow" value="0" min="0" max="100">
                </div>
                <div class="dyn-group">
                    <label class="dyn-label" style="color: #a855f7;">🟣 Tím</label>
                    <input type="number" class="dyn-input" id="urnPurple" value="0" min="0" max="100">
                </div>
                <div class="dyn-group">
                    <label class="dyn-label" style="color: var(--text-muted);">Chế độ rút</label>
                    <select class="dyn-input" id="urnMode" style="width: 250px; height: 48px; padding: 12px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); outline: none; cursor: pointer; font-size: 1rem; color: var(--text-main);">
                        <option value="with" selected>Có hoàn trả (With Replacement)</option>
                        <option value="without">Không hoàn trả (Without Replacement)</option>
                    </select>
                </div>
            `;
        } else if (type === 'birthday') {
            container.innerHTML = `
                <div class="dyn-group">
                    <label class="dyn-label" style="color: var(--text-muted);">Số người trong nhóm (k)</label>
                    <input type="number" class="dyn-input" id="bdayGroup" value="23" min="2" max="100" style="width: 120px;">
                </div>
            `;
        } else if (type === 'galton') {
            container.innerHTML = `
                <div class="dyn-group">
                    <label class="dyn-label" style="color: var(--text-muted);">Số hàng đinh (Rows)</label>
                    <input type="number" class="dyn-input" id="galtonRows" value="10" min="5" max="30" style="width: 100px;">
                </div>
            `;
        } else {
            container.innerHTML = '';
        }
    }

    // ===== Skeleton =====
    showSkeleton() {
        this.elements.skeletonContainer.style.display = '';
        document.getElementById('chartCard').style.display = 'none';
        document.getElementById('convergenceCard').style.display = 'none';
        document.getElementById('aiSection').style.display = 'none';
    }

    hideSkeleton() {
        this.elements.skeletonContainer.style.display = 'none';
    }

    // ===== Progress =====
    showProgress() {
        this.elements.progressContainer.style.display = 'flex';
        this.updateProgress(0);
    }

    updateProgress(percent) {
        const pct = Math.min(100, Math.max(0, percent));
        this.elements.progressFill.style.width = pct + '%';
        this.elements.progressText.textContent = pct.toFixed(0) + '%';
    }

    hideProgress() {
        this.elements.progressContainer.style.display = 'none';
        this.elements.progressFill.style.width = '0%';
        this.elements.progressText.textContent = '0%';
    }

    // ===== Summary Cards =====
    renderSummaryCards(n, results) {
        this.elements.summaryGrid.style.display = 'grid';
        document.getElementById('summaryTrials').textContent = n.toLocaleString();

        const avgError = results.reduce((sum, r) => sum + r.error, 0) / results.length;
        document.getElementById('summaryError').textContent = avgError.toFixed(2) + '%';

        // Find best match (lowest error)
        const best = results.reduce((min, r) => r.error < min.error ? r : min, results[0]);
        document.getElementById('summaryBest').textContent = best.label + ' (' + best.error.toFixed(2) + '%)';

        // Convergence status — dựa trên sai số thực tế, không phải n
        const convergenceEl = document.getElementById('summaryConvergence');
        if (avgError < 0.5) {
            convergenceEl.textContent = '✅ Đã hội tụ';
            convergenceEl.style.color = '#22c55e';
        } else if (avgError < 5) {
            convergenceEl.textContent = '⚠️ Gần hội tụ';
            convergenceEl.style.color = '#eab308';
        } else {
            convergenceEl.textContent = '🔄 Đang hội tụ';
            convergenceEl.style.color = 'var(--text-muted)';
        }
    }

    // ===== Tooltip =====
    setupTooltipListeners() {
        const select = document.getElementById('moduleSelect');
        select.addEventListener('change', () => this.updateTooltip(select.value));
        // Initial update
        if (select.value) this.updateTooltip(select.value);
    }

    updateTooltip(type) {
        const data = this.tooltipData[type];
        if (!data) return;
        this.elements.tooltipTitle.textContent = data.title;
        this.elements.tooltipDesc.textContent = data.desc;
        this.elements.tooltipFormula.textContent = data.formula;
    }

    // ===== Export =====
    setupExportListeners() {
        if (this.elements.exportChartPng) {
            this.elements.exportChartPng.addEventListener('click', () => this.exportChartPng());
        }
        if (this.elements.exportTableCsv) {
            this.elements.exportTableCsv.addEventListener('click', () => this.exportTableCsv());
        }
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

    exportTableCsv() {
        const rows = [];
        const headerCells = this.elements.tableHead.querySelectorAll('th');
        rows.push(Array.from(headerCells).map(th => th.textContent).join(','));

        const bodyRows = this.elements.tableBody.querySelectorAll('tr');
        bodyRows.forEach(tr => {
            const cells = tr.querySelectorAll('td');
            const row = Array.from(cells).map(td => {
                let text = td.textContent.trim();
                if (text.includes(',')) text = '"' + text + '"';
                return text;
            }).join(',');
            rows.push(row);
        });

        const csv = rows.join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.download = 'graph4prob-results.csv';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // ===== Table =====
    renderTable(results) {
        this.elements.tableHead.innerHTML = `
            <th>Kết quả</th>
            <th>Số lần (n)</th>
            <th>Thực nghiệm</th>
            <th>Lý thuyết</th>
            <th>Sai số</th>
        `;

        this.elements.tableBody.innerHTML = results.map(res => {
            const errorColor = res.error < 0.1 ? '#22c55e' : (res.error < 1 ? '#eab308' : '#ef4444');
            return `
                <tr>
                    <td><span class="badge" style="background: ${res.color || 'rgba(0,210,255,0.2)'}">${res.label}</span></td>
                    <td><code style="color: var(--text-muted);">${res.count.toLocaleString()}</code></td>
                    <td style="font-weight: 600; color: var(--text-main);">${res.empiricalProb.toFixed(3)}%</td>
                    <td style="color: var(--text-muted);">${res.theoreticalProb.toFixed(3)}%</td>
                    <td style="color: ${errorColor}; font-family: monospace;">
                        ${res.error > 0 ? '+' : ''}${res.error.toFixed(4)}%
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ===== Theme =====
    getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            grid: style.getPropertyValue('--chart-grid').trim(),
            tick: style.getPropertyValue('--chart-tick').trim(),
            legend: style.getPropertyValue('--chart-legend').trim(),
        };
    }

    updateChartTheme() {
        const colors = this.getThemeColors();
        const updateOptions = (chart) => {
            if (!chart) return;
            chart.options.scales.y.grid.color = colors.grid;
            chart.options.scales.y.ticks.color = colors.tick;
            chart.options.scales.x.grid.color = colors.grid;
            chart.options.scales.x.ticks.color = colors.tick;
            chart.options.plugins.legend.labels.color = colors.legend;
            // Update datalabels color for bar chart
            if (chart.options.plugins.datalabels) {
                chart.options.plugins.datalabels.color = colors.tick;
            }
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

    // ===== Chart =====
    renderChart(results) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        const labels = results.map(r => r.label);
        const empiricalData = results.map(r => r.empiricalProb);
        const theoreticalData = results.map(r => r.theoreticalProb);
        const theme = this.getThemeColors();
        const self = this;

        // Register datalabels plugin globally (nếu CDN load thành công)
        if (typeof ChartDataLabels !== 'undefined' && !Chart.registry.plugins.get('datalabels')) {
            Chart.register(ChartDataLabels);
        }

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
                        labels: { color: theme.legend, font: { family: 'Outfit', size: 12 } }
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
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        color: theme.tick,
                        font: {
                            weight: '600',
                            size: 11
                        },
                        offset: 2,
                        formatter: (value) => value.toFixed(1) + '%'
                    }
                }
            },
        });
    }

    // ===== Convergence Chart =====
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
                        labels: { color: theme.legend, font: { family: 'Outfit', size: 12 } }
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

    // ===== AI Insights =====
    showAIInsights(n, results) {
        this.elements.aiSection.style.display = 'block';
        let insight = `<p style="margin-bottom: 10px;">Với số mẫu <strong>n = ${n.toLocaleString()}</strong>:</p>`;

        const maxError = Math.max(...results.map(r => r.error));

        if (n < 500) {
            insight += `<p>Với số lần thử hiện tại, sai số còn khá lớn do kích thước mẫu chưa đủ lớn.</p>`;
        } else {
            insight += `<p>Kết quả thực nghiệm đã tiến rất gần xác suất lý thuyết. Đây là minh họa rõ ràng cho Luật số lớn.</p>`;
        }

        if (maxError < 1) {
            insight += `<p style="margin-top: 10px; color: #22c55e; font-weight: 600;">Hệ thống đã hội tụ rất tốt.</p>`;
        }

        if (results[0].label.includes('Kim chạm vạch')) {
            const hits = results[0].count;
            const piEstimate = (2 * n) / hits;
            insight += `<div style="margin-top: 15px; padding: 10px; background: rgba(255,0,122,0.1); border-radius: 8px; border-left: 4px solid #ff007a;">
                <p style="font-weight: 600; color: #ff007a;">📍 Ước lượng số π ≈ ${piEstimate.toFixed(6)}</p>
                <small>Công thức: π ≈ 2n / hits (khi L = D)</small>
            </div>`;
        }

        this.elements.aiContent.innerHTML = insight;
    }

    // ===== Loading =====
    setLoading(isLoading) {
        if (isLoading) {
            this.elements.runBtn.disabled = true;
            this.elements.runBtn.textContent = '⏳ Đang mô phỏng...';
        } else {
            this.elements.runBtn.disabled = false;
            this.elements.runBtn.textContent = '▶ Bắt đầu mô phỏng';
        }
    }

    // ===== Theme Icon =====
    setThemeIcon(theme) {
        const icon = document.getElementById('themeIcon');
        if (!icon) return;
        if (theme === 'dark') {
            icon.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            `;
        } else {
            icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
        }
    }
}
