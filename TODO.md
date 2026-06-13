# 🎯 Kế hoạch phát triển Graph4Prob

> Dự án: **Graph4Prob** — Trực quan hóa Luật số lớn & Xác suất
> 
> Công nghệ: Vanilla JS (ES6+ Modules), Chart.js, CSS Design System
> 
> Toàn bộ source code nằm trong thư mục `web/`

---

## 📋 Tổng quan các nhóm task

| Nhóm | Mô tả | Mức độ ưu tiên |
|------|-------|:--------------:|
| **A - UI/Brand/Theme** | Cải thiện giao diện, font, màu sắc | 🔴 Cao |
| **B - Logic Fix** | Sửa lỗi logic hiện tại | 🔴 Cao |
| **C - Code Quality** | Tối ưu & tái cấu trúc code | 🟡 Trung bình |
| **D - Testing** | Kiểm thử tự động | 🟢 Thấp |
| **E - Enhancement** | Tính năng mới (tương lai) | 🟢 Thấp |

---

## 🔴 NHÓM A — UI/Brand/Theme

### A1 — Typography: chuyển hoàn toàn Outfit → Inter

- [x] Đã chuyển font stack trong `style.css` sang Inter
- [x] Đã load Inter từ Google Fonts trong `index.html`
- [x] Đã có tokens text/leading: `--text-xs → --text-5xl`, `--leading-tight → --leading-loose`
- [x] Đã có class helpers: `.muted`, `.caption`, `.input-label`, `.section-title`, `.card-title`
- [ ] **Sửa chart legends trong `web/js/ui.js`** — 2 dòng còn reference `'Outfit'`:
  - Dòng 507: `font: { family: 'Outfit', size: 12 }` → sửa thành `'Inter'`
  - Dòng 620: `font: { family: 'Outfit', size: 12 }` → sửa thành `'Inter'`
- [ ] **Verify Google Fonts** đang load đúng weights Inter: 300, 400, 500, 600, 700 (hiện tại có)

### A2 — Color Semantic & Contrast

- [x] Đã có đầy đủ biến semantic: `--canvas-bg`, `--surface`, `--text-main`, `--text-muted`, `--border`, `--primary`, `--accent`, `--glass-bg`, `--glass-border`
- [x] Dark mode đã có đủ variant cho tất cả biến
- [ ] **Kiểm tra WCAG contrast** `--text-muted` trên nền `--surface`:
  - Light: `#475569` trên `#F8FAFC` → ratio ~5.2:1 (AA OK)
  - Dark: `#94A3B8` trên `#1E293B` → ratio ~5.8:1 (AA OK)
  - Light glass: `#475569` trên `rgba(248,250,252,0.92)` → cần kiểm tra thêm
  - Dark glass: `#94A3B8` trên `rgba(30,41,59,0.92)` → cần kiểm tra thêm
- [ ] **Thêm semantic colors** nếu thiếu:
  - `--color-success`, `--color-warning`, `--color-error`, `--color-info` (theo spec brand)

### A3 — Giảm inline styles → class helpers

- [x] Đã có các class helper cơ bản
- [ ] **Thay `display: none` inline trong `index.html`** (8 chỗ) bằng class `.hidden` hoặc quản lý qua JS
- [ ] **Thay inline `style="background: rgba(...)"`** trên 4 summary cards trong `index.html` bằng class variant:
  - Mỗi card → class `summary-icon--{type}` (blue/green/purple/amber)
- [ ] **Refactor `renderDynamicInputs()` trong `ui.js`** — chuyển inline styles thành CSS classes:
  - Các `style="width: 250px; height: 48px; border-radius: 14px; ..."` → class `.dyn-select`
  - Các `style="color: #xxx;"` trên labels → class `.dyn-label--{color}`
  - Thêm select styling class cho `#cardMode`, `#urnMode`
- [ ] **Thêm CSS class `.hidden`** vào `style.css` để thay thế `style="display: none;"`

### A4 — UI tinh chỉnh

- [ ] **Responsive: nav-subtitle** đã ẩn trên mobile (OK)
- [ ] **Kiểm tra responsive** các breakpoint 768px, 480px còn lỗi layout không
- [ ] **Theme transition** đã có cho body, navbar, glass, inputs (OK)
- [ ] **Skeleton loading** đã có shimmer animation (OK)

---

## 🔴 NHÓM B — Logic Fix (từ TASKS.md)

### B1 — Xoá cột "Phân phối trực quan" khỏi bảng kết quả

**Mô tả**: Cột progress bar cuối cùng trong bảng kết quả cần xoá để bảng gọn hơn.

**File sửa**:
- `web/js/ui.js` — method `renderTable()`:
  - Xoá `<th>Phân phối trực quan</th>` khỏi header
  - Xoá `<td>` chứa `.table-progress-bg` / `.table-progress-bar`
- `web/style.css`:
  - Xoá `.table-progress-bg`, `.table-progress-bar`

**Tiêu chí**: Bảng còn 5 cột: Kết quả, Số lần (n), Thực nghiệm, Lý thuyết, Sai số.

### B2 — Fix đường hội tụ cho module Urn

**Mô tả**: Biểu đồ "Đường hội tụ lũy tiến" của Urn hiển thị đường lý thuyết ở 0% vì `config.theoreticalProb = 0`.

**File sửa**:
- `web/js/main.js` — Trong Run handler, tính `redProb = (red / total) * 100` từ customConfig trước khi gọi `renderConvergenceChart()`
- Dùng `redProb` thay vì `engine.config.theoreticalProb` cho Urn

**Tiêu chí**: Urn (3 Đỏ + 5 Xanh) → đường lý thuyết hiển thị 37.5%.

---

## 🟡 NHÓM C — Code Quality

### C1 — Tổ chức lại CSS

- [ ] **Nhóm các rules theo component** để dễ maintain:
  - Hiện tại CSS đã có comment phân vùng (tốt)
  - Có thể di chuyển các rules lẻ vào đúng section
- [ ] **Xoá CSS rules không dùng** (nếu có) — kiểm tra với coverage
- [ ] **Chuẩn hoá border-radius**: đang dùng 24px cho glass, 14px cho input/button, 16px cho chart-wrap — thống nhất token `--radius-*`

### C2 — Tổ chức lại JS

- [ ] **Module hóa rõ ràng hơn**:
  - `simulation.js` — Engine thuần (tốt)
  - `ui.js` — DOM & Chart (hơi nặng, có thể tách chart logic ra `chart.js`)
  - `main.js` — Orchestrator (tốt)
- [ ] **Tách chart logic** từ `ui.js` sang `js/chart.js`:
  - `renderChart()`, `renderConvergenceChart()`, `updateChartTheme()`, `exportChartPng()`
- [ ] **Tách tooltip data** từ `ui.js` sang `js/data.js` hoặc giữ nguyên (chấp nhận được)
- [ ] **Đồng bộ cách xử lý customConfig** trong `main.js`:
  - Hiện tại Urn có special handling, Card/Birthday/Galton cũng vậy — có thể refactor thành 1 pattern

### C3 — Export functionality

- [ ] **Fix exportChartPng**: dùng `chart.toBase64Image()` (check API có đúng không, Chart.js v4+ dùng `toBase64Image()`)
- [ ] **Export CSV**: đã có BOM utf-8, format tốt

---

## 🟢 NHÓM D — Testing

### D1 — Kiểm thử thủ công UI

- [ ] Mở `web/index.html` bằng Live Server
- [ ] Kiểm tra tất cả 8 module khi chạy
- [ ] Check console errors
- [ ] Check dark mode toggle
- [ ] Check responsive (mobile vs desktop)
- [ ] Check export PNG & CSV

### D2 — Kiểm thử tự động

- [ ] `web/test.mjs` đã có test cơ bản cho Birthday simulation → viết thêm test cho các module khác
- [ ] **Viết test cho UI logic** (không cần DOM) — test helper functions
- [ ] **Performance test** với n = 1,000,000

---

## 🟢 NHÓM E — Enhancement (Tương lai)

### E1 — Tính năng mới

- [ ] **Lưu kết quả** vào localStorage để so sánh giữa các lần chạy
- [ ] **Multi-run comparison** — chạy nhiều lần với cùng n và vẽ overlay
- [ ] **Animation realtime** khi mô phỏng từng bước (dùng `requestAnimationFrame`)
- [ ] **Share URL** với params (module + n + config)

### E2 — Performance

- [ ] **Web Worker** cho mô phỏng nặng (n > 100,000) để không block UI
- [ ] **Virtual scrolling** cho bảng kết quả khi có nhiều dòng
- [ ] **Lazy load Chart.js** chỉ khi cần

### E3 — Accessibility

- [ ] **ARIA labels** cho các interactive elements
- [ ] **Keyboard navigation** cho toàn bộ UI
- [ ] **Focus trap** cho tooltip popup
- [ ] **Reduced motion media query** — tôn trọng prefers-reduced-motion

---

## 📈 Tiến độ hiện tại

| Nhóm | Tổng task | ✅ Done | 🔄 Pending |
|------|:---------:|:-------:|:----------:|
| A - UI/Brand/Theme | 15 | 6 | 9 |
| B - Logic Fix | 2 | 0 | 2 |
| C - Code Quality | 7 | 0 | 7 |
| D - Testing | 4 | 0 | 4 |
| E - Enhancement | 7 | 0 | 7 |
| **Tổng** | **35** | **6** | **29** |

> **Ghi chú**: Ưu tiên xử lý **Nhóm A (UI)** và **Nhóm B (Logic Fix)** trước, sau đó đến **Nhóm C (Code Quality)**.
