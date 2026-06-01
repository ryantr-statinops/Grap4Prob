/**
 * Main Entry Point for TTK-AI
 */
import { SimulationEngine, SIM_TYPES } from './simulation.js?v=3.2';
import { UIController } from './ui.js?v=3.2';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    let currentType = SIM_TYPES.DICE;
    let engine = new SimulationEngine(currentType);

    // Initial State
    ui.updateHeader(currentType);

    // Module Switcher — Dropdown
    const switchMode = (type) => {
        currentType = type;
        engine = new SimulationEngine(type);
        ui.updateHeader(type);

        // Clear results if any
        document.getElementById('aiSection').style.display = 'none';
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
        switchMode(e.target.value);
    });

    // Run Simulation
    ui.elements.runBtn.addEventListener('click', async () => {
        const n = parseInt(ui.elements.nInput.value);
        if (isNaN(n) || n <= 0) {
            alert('Vui lòng nhập số lần thử hợp lệ!');
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


        ui.setLoading(true);

        // Artificial delay for "wow" effect and animation
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const data = engine.run(n);
            ui.renderTable(data.results);
            ui.renderChart(data.results);
            ui.renderConvergenceChart(data.history, data.theoreticalProb);
            ui.showAIInsights(n, data.results);

            if (currentType === SIM_TYPES.BUFFON) {
                ui.renderBuffonVis(n);
            }
        } catch (error) {
            console.error('Simulation failed:', error);
            alert('Có lỗi xảy ra trong quá trình mô phỏng.');
        } finally {
            ui.setLoading(false);
        }
    });

});

