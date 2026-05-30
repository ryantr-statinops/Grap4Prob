## TODO - Frontend cải thiện hướng A (UI/Brand/theme)

- [x] Đọc `web/index.html` để nắm cấu trúc UI hiện tại
- [x] Đọc `web/style.css` để nắm hệ màu tokens & cách style đang áp dụng
- [x] Đọc `web/agent/skills/brand/SKILL.md`
- [x] Đọc `web/agent/skills/ui-styling/SKILL.md`
- [x] Đọc `web/agent/skills/brand/references/typography-specifications.md`
- [x] Đọc `web/agent/skills/brand/references/color-palette-management.md`
- [ ] (A1) Typography: chuyển toàn bộ font stack sang Inter (loại Outfit), thêm tokens text/leading theo spec
- [ ] (A1) Typography: tạo class helpers (muted/caption/heading) để giảm inline trong `web/index.html`
- [ ] (A2) Color semantic: alias biến màu trong `web/style.css` sang role semantic (background/surface/text primary/muted)
- [ ] (A2) Kiểm tra/chuẩn hóa contrast cho `--text-muted` trên nền glass/background
- [ ] (A3) Inline giảm dần: thay inline style phổ biến trong `web/index.html` bằng class (height/margin/overflow/font-size/color nếu thuộc nhóm themeable)
- [ ] Chạy kiểm tra UI thủ công (mở `web/index.html`) và rà các thành phần lệch font/màu
