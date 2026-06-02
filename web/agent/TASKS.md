# Development Tasks — Logic Fixes

> ⚠️ Các task dưới đây là các lỗi logic cần sửa. Task **Dark Mode** sẽ được xử lý riêng bởi người khác.

---

## Task 1: Xoá cột "Phân phối trực quan" khỏi bảng kết quả

**Mô tả**: Cột cuối cùng trong bảng kết quả (`<th>Phân phối trực quan</th>`) hiển thị một thanh progress bar cho tần suất thực nghiệm. Cần xoá cột này để bảng gọn gàng hơn.

**File cần sửa**:
- `web/js/ui.js` — method `renderTable()`:
  - Xoá `<th style="width: 150px;">Phân phối trực quan</th>` khỏi `tableHead.innerHTML`
  - Xoá toàn bộ `<td>` chứa `.table-progress-bg` / `.table-progress-bar` trong phần render row
- `web/style.css`:
  - Xoá class `.table-progress-bg`
  - Xoá class `.table-progress-bar`

**Tiêu chí hoàn thành**: Bảng kết quả chỉ còn 5 cột: Kết quả, Số lần (n), Thực nghiệm, Lý thuyết, Sai số. Không còn cột progress bar.

---

## Task 2: Xoá ô mô phỏng Kim Buffon

**Mô tả**: Section "🪡 Mô phỏng Kim Buffon" (`<section id="special-vis">`) hiển thị canvas vẽ các cây kim trên nền vạch kẻ. Cần xoá hoàn toàn tính năng này.

**File cần sửa**:
- `web/index.html` — Xoá `<section id="special-vis">...</section>` khỏi `<main>`
- `web/js/ui.js`:
  - Xoá `specialVis: document.getElementById('special-vis')` khỏi constructor
  - Trong `updateHeader()`: xoá `this.elements.specialVis.style.display = 'flex';` ở case `'buffon'`
  - Trong `updateHeader()`: xoá `this.elements.specialVis.style.display = 'none';` ở cuối function
  - Xoá toàn bộ method `renderBuffonVis(n)`
- `web/js/main.js` — Xoá block `if (currentType === SIM_TYPES.BUFFON) { ui.renderBuffonVis(n); }` trong Run handler
- `web/style.css`:
  - Xoá `.vis-section` và các rules con (`.vis-section .vis-canvas-wrap`, `.vis-section #visCanvas`)
  - Trong `@media (max-width: 768px)`: xoá `.vis-section` override

**Tiêu chí hoàn thành**: Khi chọn module "Kim Buffon", không còn hiển thị khung vẽ kim bên dưới hero-section. Console không có lỗi liên quan đến canvas hoặc specialVis.

---

## Task 3: Fix đường hội tụ lũy tiến cho module Rút bi (Urn)

**Mô tả**: Hiện tại, biểu đồ "Đường hội tụ lũy tiến" của module Urn vẽ đường giới hạn lý thuyết ở **0%** (vì `config.theoreticalProb = 0`). Cần sửa để đường lý thuyết hiển thị đúng xác suất của màu đầu tiên (màu Đỏ) dựa trên thành phần túi bi.

**Nguyên nhân**:
- Trong `simulation.js`, config của URN có `theoreticalProb: 0` (dòng 68)
- Trong `main.js`, `renderConvergenceChart(history, engine.config.theoreticalProb)` truyền giá trị 0 cho Urn
- Biểu đồ convergence chỉ tracking `counts[0]` (màu Đỏ), nên đường lý thuyết cần hiển thị xác suất đúng của màu Đỏ

**Yêu cầu**:
- Tính `theoreticalProb` cho Urn dựa trên bag composition để truyền vào `renderConvergenceChart()`
- Công thức: `số_bi_đỏ / tổng_số_bi × 100`
- Có thể tính trong `main.js` trước khi gọi `renderConvergenceChart()` trong callback progressive

**File cần sửa**:
- `web/js/main.js` — Trong Run handler, tính `redProb` từ customConfig trước khi gọi `renderConvergenceChart()`, dùng giá trị này thay vì `engine.config.theoreticalProb`

**Tiêu chí hoàn thành**: Khi chạy mô phỏng Urn (VD: 3 Đỏ + 5 Xanh), đường lý thuyết trên biểu đồ hội tụ hiển thị đúng 37.5% (= 3/8 × 100). Khi thay đổi số lượng bi, đường lý thuyết cập nhật tương ứng.
