/**
 * UI Controller for TTK-AI
 */

export class UIController {
    constructor() {
        1
        this.chart = null;
        this.elements = {
            title: document.getElementById('main-title'),
            desc: document.getElementById('main-description'),
            nInput: document.getElementById('numTrials'),
            runBtn: document.getElementById('runBtn'),
            statusIcon: document.getElementById('status-icon'),
            tableHead: document.getElementById('table-head'),
            tableBody: document.getElementById('table-body'),
            aiSection: document.getElementById('aiSection'),
            aiContent: document.getElementById('aiContent'),
            specialVis: document.getElementById('special-vis'),
            canvas: document.getElementById('visCanvas')
        };
    }

    showWelcome() {
        this.elements.title.textContent = '🎲 Graph4Prob — Mô phỏng Xác suất';
        this.elements.desc.textContent = 'Chọn một kiểu mô phỏng từ menu bên dưới để bắt đầu khám phá.';
        this.elements.statusIcon.textContent = '🎯';
        document.getElementById('dynamic-inputs').innerHTML = '';
        this.elements.specialVis.style.display = 'none';
    }

    updateHeader(type) {
        if (type === 'dice') {
            this.elements.title.textContent = 'Mô phỏng Xúc xắc';
            this.elements.desc.textContent = 'Xác suất lý thuyết cho mỗi mặt của xúc xắc 6 mặt là 1/6 (≈ 16.67%).';
            this.elements.statusIcon.textContent = '🎲';
        } else if (type === 'coin') {
            this.elements.title.textContent = 'Mô phỏng Tung đồng xu';
            this.elements.desc.textContent = 'Xác suất lý thuyết cho mỗi mặt của đồng xu cân đối là 1/2 (50%).';
            this.elements.statusIcon.textContent = '🪙';
        } else if (type === 'card') {
            this.elements.title.textContent = 'Mô phỏng Rút lá bài';
            this.elements.desc.textContent = 'Xác suất lý thuyết để rút được một chất (Cơ, Rô, Chuồn, Bích) là 1/4 (25%).';
            this.elements.statusIcon.textContent = '🃏';
        } else if (type === 'urn') {
            this.elements.title.textContent = 'Mô phỏng Rút bi (Urn Problem)';
            this.elements.desc.textContent = 'Xác suất rút được một viên bi phụ thuộc vào số lượng bi của màu đó chia cho tổng số bi trong túi.';
            this.elements.statusIcon.textContent = '🎱';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'monty') {
            this.elements.title.textContent = 'Nghịch lý Monty Hall';
            this.elements.desc.textContent = 'Bạn chọn 1 cửa. Host mở 1 cửa Dê. Bạn có nên đổi cửa không? (Luôn luôn ĐỔI có xác suất thắng 66.67%)';
            this.elements.statusIcon.textContent = '🚪';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'birthday') {
            this.elements.title.textContent = 'Nghịch lý Ngày sinh (Birthday Paradox)';
            this.elements.desc.textContent = 'Xác suất để trong một nhóm N người có ít nhất 2 người trùng ngày sinh.';
            this.elements.statusIcon.textContent = '🎂';
            this.renderDynamicInputs(type);
            return;
        } else if (type === 'buffon') {
            this.elements.title.textContent = 'Kim Buffon (Ước lượng số Pi)';
            this.elements.desc.textContent = 'Mô phỏng việc thả một cây kim lên mặt phẳng có các đường kẻ song song để ước lượng giá trị của số π.';
            this.elements.statusIcon.textContent = '🪡';
            this.renderDynamicInputs(type);
            this.elements.specialVis.style.display = 'flex';
            return;
        } else if (type === 'galton') {
            this.elements.title.textContent = 'Bàn Galton (Định lý Giới hạn Trung tâm)';
            this.elements.desc.textContent = 'Các viên bi rơi qua các hàng đinh ngẫu nhiên sẽ hội tụ về Phân phối Chuẩn (Bell Curve).';
            this.elements.statusIcon.textContent = '🛝';
            this.renderDynamicInputs(type);
            this.elements.specialVis.style.display = 'none';
            return;
        }

        // Clear dynamic inputs for simple simulations
        document.getElementById('dynamic-inputs').innerHTML = '';
        this.elements.specialVis.style.display = 'none';
    }

    renderDynamicInputs(type) {
        const container = document.getElementById('dynamic-inputs');
        if (type === 'urn') {
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
            <th style="width: 150px;">Phân phối trực quan</th>
        `;

        this.elements.tableBody.innerHTML = results.map(res => {
            const barWidth = Math.min(100, res.empiricalProb);
            const errorColor = res.error < 0.1 ? '#22c55e' : (res.error < 1 ? '#eab308' : '#ef4444');
            
            return `
                <tr>
                    <td><span class="badge" style="background: ${res.color || 'rgba(0,210,255,0.2)'}">${res.label}</span></td>
                    <td><code style="color: #94a3b8;">${res.count.toLocaleString()}</code></td>
                    <td style="font-weight: 600; color: #0F172A;">${res.empiricalProb.toFixed(3)}%</td>
                    <td style="color: #94a3b8;">${res.theoreticalProb.toFixed(3)}%</td>
                    <td style="color: ${errorColor}; font-family: monospace;">
                        ${res.error > 0 ? '+' : ''}${res.error.toFixed(4)}%
                    </td>
                    <td>
                        <div class="table-progress-bg">
                            <div class="table-progress-bar" style="width: ${barWidth}%; background: ${res.color || '#00d2ff'};"></div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderChart(results) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        const labels = results.map(r => r.label);
        const empiricalData = results.map(r => r.empiricalProb);
        const theoreticalData = results.map(r => r.theoreticalProb);

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Thực nghiệm (%)',
                        data: empiricalData,
                        backgroundColor: 'rgba(0, 210, 255, 0.6)',
                        borderColor: '#00d2ff',
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
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#475569', font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

    renderConvergenceChart(history, theoreticalProb) {
        const ctx = document.getElementById('convergenceChart').getContext('2d');

        if (this.convergenceChart) {
            this.convergenceChart.destroy();
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
                        title: { display: true, text: 'Số lần thử (n)', color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        title: { display: true, text: 'Tỉ lệ (%)', color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#475569', font: { family: 'Outfit' } }
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
            insight += `<p>Kết quả có độ <strong>dao động cao</strong>. Sai số lớn nhất lên tới ${maxError.toFixed(2)}%. Điều này là bình thường vì kích thước mẫu chưa đủ lớn để triệt tiêu các biến số ngẫu nhiên.</p>`;
        } else if (n < 5000) {
            insight += `<p>Dữ liệu bắt đầu <strong>hội tụ</strong>. Các cột tần suất đã tiến sát đường lý thuyết. Sai số trung bình đang giảm dần theo quy luật căn bậc hai của n.</p>`;
        } else {
            insight += `<p>Minh họa <strong>hoàn hảo</strong> cho Luật số lớn. Với n rất lớn, các biến cố ngẫu nhiên tự triệt tiêu lẫn nhau, khiến tần suất thực tế gần như trùng khớp với xác suất lý thuyết (sai số cực nhỏ: ${maxError.toFixed(4)}%).</p>`;
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

    setLoading(isLoading) {
        if (isLoading) {
            this.elements.runBtn.disabled = true;
            this.elements.runBtn.textContent = 'Đang tính toán...';
            this.elements.statusIcon.classList.add('rolling');
        } else {
            this.elements.runBtn.disabled = false;
            this.elements.runBtn.textContent = '▶ Bắt đầu mô phỏng';
            this.elements.statusIcon.classList.remove('rolling');
        }
    }
}
