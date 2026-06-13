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
| **A - UI/Brand/Theme** | Cải thiện giao diện, font, màu sắc | 🔴 Cao ✅ |
| **B - Logic Fix** | Sửa lỗi logic hiện tại | 🔴 Cao ✅ |
| **C - Code Quality** | Tối ưu & tái cấu trúc code | 🟡 Trung bình |
| **D - Testing** | Kiểm thử tự động | 🟢 Thấp |
| **E - Enhancement** | Tính năng mới (tương lai) | 🟢 Thấp |

---

## ✅ NHÓM A — UI/Brand/Theme (Hoàn thành)

### A1 — Typography: chuyển hoàn toàn Outfit → Inter

- [x] Đã chuyển font stack trong `style.css` sang Inter
- [x] Đã load Inter từ Google Fonts trong `index.html`
- [x] Đã có tokens text/leading: `--text-xs → --text-5xl`, `--leading-tight → --leading-loose`
- [x] Đã có class helpers: `.muted`, `.caption`, `.input-label`, `.section-title`, `.card-title`
- [x] **Sửa chart legends trong `web/js/ui.js`** — 2 dòng `'Outfit'` → `'Inter'`
- [ ] **Verify Google Fonts** đang load đúng weights Inter: 300, 400, 500, 600, 700 (hiện tại có) — *có thể bỏ qua*

### A2 — Color Semantic & Contrast

- [x] Đã có đầy đủ biến semantic: `--canvas-bg`, `--surface`, `--text-main`, `--text-muted`, `--border`, `--primary`, `--accent`, `--glass-bg`, `--glass-border`
- [x] Dark mode đã có đủ variant cho tất cả biến
- [ ] **Kiểm tra WCAG contrast** `--text-muted` trên nền `--surface` (light/dark) — *tạm hoãn*
- [ ] **Thêm semantic colors**: `--color-success`, `--color-warning`, `--color-error`, `--color-info` — *tạm hoãn*

### A3 — Giảm inline styles → class helpers (✅ Hoàn thành)

- [x] Đã có các class helper cơ bản
- [x] **Thay `display: none` inline** (8 chỗ) bằng class `.hidden` + JS classList API
- [x] **Thay inline `background`** trên 4 summary cards → class `summary-icon--{blue/green/purple/amber}`
- [x] **Refactor `renderDynamicInputs()`** — inline styles → `.dyn-select`, `.dyn-label--{muted/red/blue/green/amber/purple}`, `.dyn-input--w120/w100`
- [x] **Thêm CSS class `.hidden`** vào `style.css`

### Bugs fixed (phát hiện qua code review)

- [x] Fix `hideSkeleton()` wasVisible check (dùng classList thay vì style.display)
- [x] Fix CSS `transfor` typo → `transform: rotate(45deg)`
- [x] Fix responsive: thêm `.dyn-select` vào rule `width: 100%` mobile

---

## ✅ NHÓM B — Logic Fix (Hoàn thành)

### B1 — Xoá cột "Phân phối trực quan" khỏi bảng kết quả

- [x] JS `renderTable()` đã sạch cột progress bar từ trước
- [x] Xoá CSS dead code: `.table-progress-bg`, `.table-progress-bar`, xoá khỏi transition selector

**Kết quả**: Bảng còn 5 cột: Kết quả, Số lần (n), Thực nghiệm, Lý thuyết, Sai số.

### B2 — Fix đường hội tụ cho module Urn

- [x] Đã có sẵn trong `main.js` (dòng 150-152): override `theoreticalProb` = `(red / total) * 100`

**Kết quả**: Urn (3 Đỏ + 5 Xanh) → đường lý thuyết hiển thị đúng 37.5%.

---

## 🟡 NHÓM C — Code Quality (Đang làm)

### C1 — Tổ chức lại CSS (✅ Hoàn thành)

- [x] **Chuẩn hoá border-radius**: 23 giá trị cứng → 7 tokens (`--radius-sm` → `--radius-full`)
- [ ] **Nhóm các rules theo component** để dễ maintain — *tạm hoãn*
- [ ] **Xoá CSS rules không dùng** — *tạm hoãn*

### C2 — Tổ chức lại JS (✅ Hoàn thành)

- [x] **Tách chart logic** từ `ui.js` sang `web/js/chart.js`:
  - `ChartManager` class mới: `renderChart()`, `renderConvergenceChart()`, `updateTheme()`, `getThemeColors()`, `exportChartPng()`, `destroyAll()`
  - `ui.js` giảm từ ~510 dòng → ~230 dòng
  - `chart.js` mới ~230 dòng
- [ ] **Tách tooltip data** từ `ui.js` sang `js/data.js` — *tạm hoãn*
- [ ] **Đồng bộ customConfig** trong `main.js` — *tạm hoãn*

### C3 — Export functionality

- [ ] Kiểm tra `exportChartPng` (Chart.js v4+ API)
- [ ] **Export CSV**: đã có BOM utf-8, format tốt

---

## 🟢 NHÓM D — Testing (Đã test 1 phần)

### D1 — Kiểm thử thủ công UI (✅ Đã test)

- [x] Mở `web/index.html` bằng Live Server (port 5501)
- [x] Kiểm tra Xúc xắc (Dice) + Đồng xu (Coin) — bar chart, table, AI insights OK
- [x] Check console errors — **0 lỗi**
- [x] Check dark mode toggle — OK
- [ ] Kiểm tra 6 module còn lại (Card, Urn, Monty, Birthday, Buffon, Galton)
- [ ] Check responsive (mobile vs desktop)
- [ ] Check export PNG & CSV

### D2 — Kiểm thử tự động

- [ ] `web/test.mjs` — viết thêm test cho các module khác
- [ ] **Viết test cho UI logic** (không cần DOM)
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
| A - UI/Brand/Theme | 15 | 13 | 2 |
| B - Logic Fix | 2 | 2 | 0 |
| C - Code Quality | 7 | 4 | 3 |
| D - Testing | 4 | 1 | 3 |
| E - Enhancement | 7 | 0 | 7 |
| **Tổng** | **35** | **20** | **15** |

> **Ghi chú**: Đã hoàn thành A + B + C1 + C2. Các nhóm A/B đã ✅.
