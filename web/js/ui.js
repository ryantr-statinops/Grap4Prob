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
            aiContent: document.getElementById('aiContent')
        };
    }

    showWelcome() {
        this.elements.title.textContent = '🎲 Graph4Prob — Mô phỏng Xác suất';
        this.elements.desc.textContent = 'Chọn một kiểu mô phỏng từ menu bên dưới để bắt đầu khám phá.';
        document.getElementById('dynamic-inputs').innerHTML = '';
    }

    updateHeader(type) {
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

        // Clear dynamic inputs for simple simulations
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

    renderTable(results) {
        // Clear previous
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

        // Helper: chuyển hex → rgba, giữ nguyên HSL/RGB (dùng cho Galton)
        const toBarBackground = (color, alpha) => {
            if (!color) return `rgba(0, 210, 255, ${alpha})`;
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            // HSL/RGB — Chart.js chấp nhận trực tiếp
            return color;
        };

        // Mỗi cột lấy màu riêng từ results[i].color (giống bảng chi tiết)
        const barColors = results.map(r => toBarBackground(r.color, 0.65));
        const barBorderColors = results.map(r => r.color || '#00d2ff');

        if (this.chart) {
            // Incremental update — animate bars growing
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
                        borderWidth: 1,
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
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: theme.grid },
                        ticks: { color: theme.tick }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: theme.tick }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: theme.legend, font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

    renderConvergenceChart(history, theoreticalProb) {
        const ctx = document.getElementById('convergenceChart').getContext('2d');
        const theme = this.getThemeColors();

        if (this.convergenceChart) {
            // Incremental update — draw more points as simulation progresses
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
                        borderWidth: 2,
                        pointRadius: history.length > 50 ? 0 : 3,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Giới hạn lý thuyết',
                        data: [
                            { x: 0, y: theoreticalProb },
                            { x: history[history.length - 1].x, y: theoreticalProb }
                        ],
                        borderColor: '#ff007a',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Số lần thử (n)', color: theme.tick },
                        grid: { color: theme.grid },
                        ticks: { color: theme.tick }
                    },
                    y: {
                        title: { display: true, text: 'Tỉ lệ (%)', color: theme.tick },
                        grid: { color: theme.grid },
                        ticks: { color: theme.tick }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: theme.legend, font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

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
        } else if (this.elements.title.textContent.includes('Galton')) {
            insight += `<div style="margin-top: 15px; padding: 10px; background: rgba(34,197,94,0.1); border-radius: 8px; border-left: 4px solid #22c55e;">
                <p style="font-weight: 600; color: #22c55e;">📈 Định lý Giới hạn Trung tâm (CLT)</p>
                <small>Tổng của nhiều biến ngẫu nhiên độc lập sẽ hội tụ về Phân phối Chuẩn (Hình chuông).</small>
            </div>`;
        }

        this.elements.aiContent.innerHTML = insight;
    }

    renderBuffonVis(n) {
        const canvas = this.elements.canvas;
        const ctx = canvas.getContext('2d');
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        
        // Draw Lines (vertical grid lines)
        const spacing = 60;
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw Needles (only show 200 for performance and clarity)
        const displayLimit = Math.min(n, 200);
        for (let i = 0; i < displayLimit; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const angle = Math.random() * Math.PI;
            const length = spacing; // L = D

            const x2 = x + Math.cos(angle) * length;
            const y2 = y + Math.sin(angle) * length;

            // Check if touches a line
            const hit = Math.floor(x / spacing) !== Math.floor(x2 / spacing);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = hit ? '#ff007a' : 'rgba(0, 210, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    setThemeIcon(theme) {
        const icon = document.getElementById('themeIcon');
        if (!icon) return;
        if (theme === 'dark') {
            // Sun icon for dark mode (switch to light)
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
            // Moon icon for light mode (switch to dark)
            icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
        }
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.elements.runBtn.disabled = true;
            this.elements.runBtn.textContent = 'Đang tính toán...';
        } else {
            this.elements.runBtn.disabled = false;
            this.elements.runBtn.textContent = '▶ Bắt đầu mô phỏng';
        }
    }
}
