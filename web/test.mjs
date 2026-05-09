import { SimulationEngine, SIM_TYPES } from './js/simulation.js';

try {
    const engine = new SimulationEngine(SIM_TYPES.BIRTHDAY, { groupSize: 23 });
    const result = engine.run(1000);
    console.log('SUCCESS:', result.theoreticalProb, result.results.length);
} catch (e) {
    console.error('ERROR:', e);
}
