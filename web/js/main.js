/**
 * Main Entry Point for TTK-AI
 */
import { SimulationEngine, SIM_TYPES } from './simulation.js?v=3.2';
import { UIController } from './ui.js?v=3.2';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    let currentType = null;
    let engine = null;

    // ===== Theme System =====
    function initTheme() {
        const saved = localStorage.getItem('graph4prob-theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        ui.setThemeIcon(saved);
        // Update chart colors after charts are created (lazy: called after render)
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('graph4prob-theme', next);
        ui.setThemeIcon(next);
        // Update existing chart colors to match new theme
        ui.updateChartTheme();
    }

    initTheme();

    document.getElementById('settingsBtn').addEventListener('click', toggleTheme);

    // Initial State — show welcome, no module selected
    ui.showWelcome();

    // Module Switcher — Dropdown
    const switchMode = (type) => {
        currentType = type;
        engine = new SimulationEngine(type);
        ui.updateHeader(type);

        // Clear & hide results
        document.getElementById('aiSection').style.display = 'none';
        document.getElementById('chartCard').style.display = 'none';
        document.getElementById('convergenceCard').style.display = 'none';
        if (ui.chart) {
            ui.chart.destroy();
            ui.chart = null;
        }
        if (ui.convergenceChart) {
            ui.convergenceChart.destroy();
            ui.convergenceChart = null;
        }
        document.getElementById('table-body').innerHTML = '';
    };

    document.getElementById('moduleSelect').addEventListener('change', (e) => {
        if (e.target.value) {
            switchMode(e.target.value);
        }
    });

    // Run Simulation
    ui.elements.runBtn.addEventListener('click', async () => {
        if (!currentType) {
            alert('Vui lòng chọn kiểu mô phỏng trước!');
            return;
        }
        const n = parseInt(ui.elements.nInput.value);
        if (isNaN(n) || n <= 0) {
            alert('Vui lòng nhập số lần thử!');
            return;
        }

        let customConfig = null;
        if (currentType === SIM_TYPES.URN) {
            customConfig = {
                red: parseInt(document.getElementById('urnRed').value) || 0,
                blue: parseInt(document.getElementById('urnBlue').value) || 0,
                green: parseInt(document.getElementById('urnGreen').value) || 0,
                yellow: parseInt(document.getElementById('urnYellow').value) || 0,
                purple: parseInt(document.getElementById('urnPurple').value) || 0
            };
            if (customConfig.red + customConfig.blue + customConfig.green + customConfig.yellow + customConfig.purple === 0) {
                alert('Túi bi không được để trống!');
                return;
            }
            engine = new SimulationEngine(currentType, customConfig);
        } else if (currentType === SIM_TYPES.BIRTHDAY) {
            customConfig = {
                groupSize: parseInt(document.getElementById('bdayGroup').value) || 23
            };
            engine = new SimulationEngine(currentType, customConfig);
        } else if (currentType === SIM_TYPES.MONTY) {
            engine = new SimulationEngine(currentType); // Reset config
        } else if (currentType === SIM_TYPES.BUFFON) {
            engine = new SimulationEngine(currentType);
        } else if (currentType === SIM_TYPES.GALTON) {
            customConfig = {
                rows: parseInt(document.getElementById('galtonRows').value) || 10
            };
            engine = new SimulationEngine(currentType, customConfig);
        }

        let theoreticalProb = engine.config.theoreticalProb;
        if (currentType === SIM_TYPES.URN && customConfig) {
            const total = customConfig.red + customConfig.blue + customConfig.green + customConfig.yellow + customConfig.purple;
            theoreticalProb = total > 0 ? (customConfig.red / total) * 100 : 0;
        }

        ui.setLoading(true);

        // Hiện chart cards ngay lập tức
        document.getElementById('chartCard').style.display = '';
        document.getElementById('convergenceCard').style.display = '';

        try {
            const data = await engine.runProgressive(n, (current, total, counts, history) => {
                // Tính kết quả trung gian và cập nhật chart + table dần
                const intermediateResults = engine.computeResults(counts, current);
                ui.renderChart(intermediateResults);
                ui.renderTable(intermediateResults);
                ui.renderConvergenceChart(history, theoreticalProb);
            });
            
            // Final render với dữ liệu đầy đủ
            ui.renderTable(data.results);
            ui.renderChart(data.results);
            ui.renderConvergenceChart(data.history, theoreticalProb);
            ui.showAIInsights(n, data.results);
        } catch (error) {
            console.error('Simulation failed:', error);
            alert('Có lỗi xảy ra trong quá trình mô phỏng.');
        } finally {
            ui.setLoading(false);
        }
    });

});

