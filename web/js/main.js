/**
 * Main Entry Point for TTK-AI
 */
import { SimulationEngine, SIM_TYPES } from './simulation.js?v=3.5';
import { UIController } from './ui.js?v=3.5';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    let currentType = null;
    let engine = null;

    // ===== Theme System =====
    function initTheme() {
        const saved = localStorage.getItem('graph4prob-theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        ui.setThemeIcon(saved);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('graph4prob-theme', next);
        ui.setThemeIcon(next);
        ui.updateChartTheme();
    }

    initTheme();
    document.getElementById('settingsBtn').addEventListener('click', toggleTheme);

    // ===== Enter shortcut =====
    ui.elements.nInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') ui.elements.runBtn.click();
    });

    // ===== Lucide icons init =====
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // ===== Spotlight: vệt sáng theo chuột =====
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });

    // ===== Initial State =====
    ui.showWelcome();

    // ===== Preset Buttons =====
    document.getElementById('presetGroup').addEventListener('click', (e) => {
        const btn = e.target.closest('.preset-btn');
        if (!btn) return;
        const value = parseInt(btn.dataset.value);
        if (!isNaN(value)) {
            ui.elements.nInput.value = value;
        }
    });

    // ===== Module Switcher =====
    const switchMode = (type) => {
        currentType = type;
        engine = new SimulationEngine(type);
        ui.updateHeader(type);

        // Clear & hide results
        document.getElementById('aiSection').style.display = 'none';
        document.getElementById('chartCard').style.display = 'none';
        document.getElementById('convergenceCard').style.display = 'none';
        ui.hideSkeleton();
        ui.hideProgress();
        ui.elements.summaryGrid.style.display = 'none';
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

    // ===== Run Simulation =====
    ui.elements.runBtn.addEventListener('click', async () => {
        if (!currentType) {
            alert('Vui lòng chọn kiểu mô phỏng trước!');
            return;
        }
        let n = parseInt(ui.elements.nInput.value);
        if (isNaN(n) || n <= 0) {
            alert('Vui lòng nhập số lần thử!');
            return;
        }

        let customConfig = null;
        if (currentType === SIM_TYPES.CARD) {
            customConfig = {
                mode: document.getElementById('cardMode').value
            };
            if (customConfig.mode === 'without' && n > 52) {
                alert(`Ở chế độ không hoàn trả, số lần thử (n = ${n}) không thể lớn hơn 52 lá bài. Hệ thống sẽ tự động đặt n = 52.`);
                ui.elements.nInput.value = 52;
                n = 52;
            }
            engine = new SimulationEngine(currentType, customConfig);
        } else if (currentType === SIM_TYPES.URN) {
            customConfig = {
                red: parseInt(document.getElementById('urnRed').value) || 0,
                blue: parseInt(document.getElementById('urnBlue').value) || 0,
                green: parseInt(document.getElementById('urnGreen').value) || 0,
                yellow: parseInt(document.getElementById('urnYellow').value) || 0,
                purple: parseInt(document.getElementById('urnPurple').value) || 0,
                mode: document.getElementById('urnMode').value
            };
            const totalBalls = customConfig.red + customConfig.blue + customConfig.green + customConfig.yellow + customConfig.purple;
            if (totalBalls === 0) {
                alert('Túi bi không được để trống!');
                return;
            }
            if (customConfig.mode === 'without' && n > totalBalls) {
                alert(`Ở chế độ không hoàn trả, số lần thử (n = ${n}) không thể lớn hơn tổng số bi trong túi (tổng = ${totalBalls}). Hệ thống sẽ tự động đặt n = ${totalBalls}.`);
                ui.elements.nInput.value = totalBalls;
                n = totalBalls;
            }
            engine = new SimulationEngine(currentType, customConfig);
        } else if (currentType === SIM_TYPES.BIRTHDAY) {
            customConfig = {
                groupSize: parseInt(document.getElementById('bdayGroup').value) || 23
            };
            engine = new SimulationEngine(currentType, customConfig);
        } else if (currentType === SIM_TYPES.MONTY) {
            engine = new SimulationEngine(currentType);
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
        } else if (currentType === SIM_TYPES.GALTON) {
            theoreticalProb = engine.getIndividualTheoreticalProb(0);
        }

        // ===== Show skeleton + progress =====
        ui.showSkeleton();
        ui.showProgress();
        ui.setLoading(true);

        // Show chart cards skeleton area
        document.getElementById('chartCard').style.display = '';
        document.getElementById('convergenceCard').style.display = '';

        try {
            const data = await engine.runProgressive(n, (current, total, counts, history) => {
                // Update progress bar
                const pct = (current / total) * 100;
                ui.updateProgress(pct);

                const intermediateResults = engine.computeResults(counts, current);
                ui.hideSkeleton();
                ui.renderChart(intermediateResults);
                ui.renderTable(intermediateResults);
                ui.renderConvergenceChart(history, theoreticalProb);
            });

            // Final render
            ui.hideSkeleton();
            ui.hideProgress();
            ui.renderTable(data.results);
            ui.renderChart(data.results);
            ui.renderConvergenceChart(data.history, theoreticalProb);
            ui.renderSummaryCards(data.n, data.results);
            ui.showAIInsights(data.n, data.results);
        } catch (error) {
            console.error('Simulation failed:', error);
            alert('Có lỗi xảy ra trong quá trình mô phỏng.');
            ui.hideSkeleton();
            ui.hideProgress();
        } finally {
            ui.setLoading(false);
        }
    });

});
