/**
 * Simulation Engine for Law of Large Numbers
 */

export const SIM_TYPES = {
    DICE: 'dice',
    COIN: 'coin',
    CARD: 'card',
    URN: 'urn',
    MONTY: 'monty', // Nghịch lý Monty Hall
    BIRTHDAY: 'birthday', // Nghịch lý Ngày sinh
    BUFFON: 'buffon', // Kim Buffon
    GALTON: 'galton' // Bàn Galton
};

export class SimulationEngine {
    constructor(type = SIM_TYPES.DICE, customConfig = null) {
        this.type = type;
        this.config = this.getConfigs(type, customConfig);
    }

    getConfigs(type, customConfig) {
        if (type === SIM_TYPES.DICE) {
            return {
                faces: [1, 2, 3, 4, 5, 6],
                theoreticalProb: 100 / 6,
                labels: ['Mặt 1', 'Mặt 2', 'Mặt 3', 'Mặt 4', 'Mặt 5', 'Mặt 6'],
                icon: '🎲',
                isTrackingFirstOnly: false,
                colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']
            };
        } else if (type === SIM_TYPES.COIN) {
            return {
                faces: [0, 1],
                theoreticalProb: 50,
                labels: ['Mặt Ngửa (Heads)', 'Mặt Sấp (Tails)'],
                icon: '🪙',
                isTrackingFirstOnly: false,
                colors: ['#00d2ff', '#3a7bd5']
            };
        } else if (type === SIM_TYPES.CARD) {
            return {
                faces: [0, 1, 2, 3],
                theoreticalProb: 25,
                labels: ['Bích (Spades) ♠', 'Cơ (Hearts) ♥', 'Rô (Diamonds) ♦', 'Chuồn (Clubs) ♣'],
                icon: '🃏',
                isTrackingFirstOnly: false,
                colors: ['#1e293b', '#ef4444', '#f87171', '#334155']
            };
        } else if (type === SIM_TYPES.URN) {
            const red = customConfig?.red || 0;
            const blue = customConfig?.blue || 0;
            const green = customConfig?.green || 0;
            const yellow = customConfig?.yellow || 0;
            const purple = customConfig?.purple || 0;
            const total = red + blue + green + yellow + purple || 1;
            
            const bag = [];
            for(let i=0; i<red; i++) bag.push(0);
            for(let i=0; i<blue; i++) bag.push(1);
            for(let i=0; i<green; i++) bag.push(2);
            for(let i=0; i<yellow; i++) bag.push(3);
            for(let i=0; i<purple; i++) bag.push(4);

            return {
                bag: bag,
                faces: [0, 1, 2, 3, 4],
                theoreticalProb: 0, // Will be calculated per result
                labels: ['Bi Đỏ 🔴', 'Bi Xanh Dương 🔵', 'Bi Xanh Lá 🟢', 'Bi Vàng 🟡', 'Bi Tím 🟣'],
                icon: '🎱',
                isTrackingFirstOnly: false,
                colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7']
            };
        } else if (type === SIM_TYPES.MONTY) {
            return {
                faces: [0, 1],
                theoreticalProb: 66.6667,
                labels: ['Thắng nếu ĐỔI CỬA 🚪', 'Thắng nếu GIỮ NGUYÊN 🛑'],
                icon: '🚪',
                isTrackingFirstOnly: true,
                colors: ['#22c55e', '#ef4444']
            };
        } else if (type === SIM_TYPES.BIRTHDAY) {
            const groupSize = customConfig?.groupSize || 23;
            let probNoMatch = 1.0;
            for (let i = 0; i < groupSize; i++) {
                probNoMatch *= (365 - i) / 365;
            }
            const probMatch = (1 - probNoMatch) * 100;

            return {
                groupSize: groupSize,
                faces: [0, 1],
                theoreticalProb: probMatch,
                labels: [`Có người trùng (${groupSize} người)`, 'Không ai trùng'],
                icon: '🎂',
                isTrackingFirstOnly: true,
                colors: ['#a855f7', '#64748b']
            };
        } else if (type === SIM_TYPES.BUFFON) {
            // Giả sử chiều dài kim = khoảng cách vạch = 1
            // Xác suất chạm vạch là 2/pi
            return {
                faces: [0, 1], // 0: Chạm vạch, 1: Không chạm
                theoreticalProb: (2 / Math.PI) * 100,
                labels: ['Kim chạm vạch 🪡', 'Kim không chạm'],
                icon: '🪡',
                isTrackingFirstOnly: true,
                colors: ['#ff007a', '#64748b']
            };
        } else if (type === SIM_TYPES.GALTON) {
            const rows = customConfig?.rows || 10;
            const labels = [];
            for (let i = 0; i <= rows; i++) labels.push(`Ô ${i}`);
            
            return {
                rows: rows,
                faces: Array.from({length: rows + 1}, (_, i) => i),
                theoreticalProb: 0, // Tính sau theo Binomial
                labels: labels,
                icon: '🛝',
                isTrackingFirstOnly: false,
                colors: labels.map((_, i) => `hsl(${200 + (i/rows)*100}, 70%, 60%)`)
            };
        }
    }

    run(n) {
        const counts = new Array(this.config.faces.length).fill(0);
        const history = [];
        const sampleInterval = Math.max(1, Math.floor(n / 100));

        // Dùng cho Urn
        const bag = this.config.bag;

        // Pre-allocate arrays for BIRTHDAY simulation to avoid GC pauses
        let birthdaysArray = null;
        let touchedDays = null;
        if (this.type === SIM_TYPES.BIRTHDAY) {
            birthdaysArray = new Uint8Array(365);
            touchedDays = new Int32Array(this.config.groupSize);
        }

        for (let i = 1; i <= n; i++) {
            let roll;
            if (this.type === SIM_TYPES.URN) {
                const idx = Math.floor(Math.random() * bag.length);
                roll = bag[idx];
            } else if (this.type === SIM_TYPES.MONTY) {
                // 3 doors: 0, 1, 2
                const prizeDoor = Math.floor(Math.random() * 3);
                const pickDoor = Math.floor(Math.random() * 3);
                if (prizeDoor === pickDoor) {
                    roll = 1; // Stay wins
                } else {
                    roll = 0; // Switch wins
                }
            } else if (this.type === SIM_TYPES.BIRTHDAY) {
                const groupSize = this.config.groupSize;
                let hasMatch = false;
                let touchedCount = 0;
                
                for (let j = 0; j < groupSize; j++) {
                    const bday = Math.floor(Math.random() * 365);
                    if (birthdaysArray[bday] === 1) {
                        hasMatch = true;
                        break;
                    }
                    birthdaysArray[bday] = 1;
                    touchedDays[touchedCount++] = bday;
                }
                roll = hasMatch ? 0 : 1;
                
                // Fast cleanup
                for (let j = 0; j < touchedCount; j++) {
                    birthdaysArray[touchedDays[j]] = 0;
                }
            } else if (this.type === SIM_TYPES.BUFFON) {
                const angle = Math.random() * Math.PI / 2;
                const centerPos = Math.random() * 0.5; // Giả sử D = 1
                const hit = centerPos <= (0.5 * Math.sin(angle)); // Giả sử L = 1
                roll = hit ? 0 : 1;
            } else if (this.type === SIM_TYPES.GALTON) {
                let position = 0;
                for (let j = 0; j < this.config.rows; j++) {
                    if (Math.random() > 0.5) position++;
                }
                roll = position;
            } else {
                roll = Math.floor(Math.random() * this.config.faces.length);
            }
            
            counts[roll]++;

            if (i % sampleInterval === 0 || i === n) {
                const currentProb = (counts[0] / i) * 100;
                history.push({ x: i, y: currentProb });
            }
        }


        const results = counts.map((count, index) => {
            const empiricalProb = (count / n) * 100;
            // Xác suất lý thuyết tuỳ thuộc vào loại
            let tProb = this.config.theoreticalProb;
            if (this.type === SIM_TYPES.URN) {
                const colorsCount = [
                    bag.filter(x => x === 0).length,
                    bag.filter(x => x === 1).length,
                    bag.filter(x => x === 2).length,
                    bag.filter(x => x === 3).length,
                    bag.filter(x => x === 4).length
                ];
                tProb = (colorsCount[index] / bag.length) * 100;
            } else if (this.type === SIM_TYPES.MONTY) {
                tProb = index === 0 ? 66.6667 : 33.3333; // 0: Switch, 1: Stay
            } else if (this.type === SIM_TYPES.BIRTHDAY) {
                tProb = index === 0 ? this.config.theoreticalProb : (100 - this.config.theoreticalProb);
            } else if (this.type === SIM_TYPES.BUFFON) {
                tProb = index === 0 ? (2 / Math.PI) * 100 : (1 - 2 / Math.PI) * 100;
            } else if (this.type === SIM_TYPES.GALTON) {
                // Phân phối nhị thức: P(k) = C(n, k) * p^k * (1-p)^(n-k)
                const r = this.config.rows;
                const k = index;
                const combinations = (n_val, k_val) => {
                    if (k_val < 0 || k_val > n_val) return 0;
                    if (k_val === 0 || k_val === n_val) return 1;
                    if (k_val > n_val / 2) k_val = n_val - k_val;
                    let res = 1;
                    for (let i = 1; i <= k_val; i++) {
                        res = res * (n_val - i + 1) / i;
                    }
                    return res;
                };
                tProb = combinations(r, k) * Math.pow(0.5, r) * 100;
            }


            const error = Math.abs(empiricalProb - tProb);
            return {
                label: this.config.labels[index],
                count,
                empiricalProb,
                theoreticalProb: tProb,
                error,
                color: this.config.colors ? this.config.colors[index] : null
            };
        }).filter(res => {
            // Đối với Rút bi, ẩn những màu có số lượng = 0 để tránh rối
            if (this.type === SIM_TYPES.URN) {
                return res.theoreticalProb > 0;
            }
            return true;
        });

        return {
            n,
            results,
            history,
            type: this.type,
            icon: this.config.icon,
            theoreticalProb: this.config.theoreticalProb
        };
    }
}
