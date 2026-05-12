# DEPLOY: Publish lên GitHub Pages

Dự án này là web tĩnh (HTML/CSS/JS ES Modules) nên deploy lên **GitHub Pages** theo kiểu “upload static files”.

---

## 1) Xác định cấu trúc publish
Các file chạy chính nằm trong thư mục `web/`:
- `web/index.html`
- `web/style.css`
- `web/js/*`
- (option) `web/agent/*` (chỉ là tài liệu)

Vì vậy ta sẽ publish **toàn bộ nội dung của thư mục `web/`** lên Pages.

---

## 2) Chuẩn bị repository
1. Kiểm tra đã commit và push toàn bộ code lên GitHub.
2. (Khuyến nghị) tạo branch mới trước khi deploy:
   - `blackboxai/deploy-gh-pages`

---

## 3) Cách deploy (khuyến nghị): GitHub Actions “Deploy to Pages”
Cách này đảm bảo tự động deploy mỗi lần push.

### 3.1 Tạo thư mục workflow
Tạo file:
- `.github/workflows/deploy.yml`

Nội dung tham khảo:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

env:
  # Publish folder
  PUBLISH_DIR: web

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # (Không cần build) vì đây là static site
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ${{ env.PUBLISH_DIR }}

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> Lưu ý: Tên thư mục publish là `web`. Nếu bạn đổi cấu trúc sau này, chỉ cần sửa `PUBLISH_DIR`.

---

## 4) Cấu hình GitHub Pages trong repo
1. Vào **Repo Settings → Pages**
2. Chọn **Build and deployment**: **GitHub Actions**
3. Kiểm tra “Source” được trỏ đúng workflow (deploy.yml)
4. Save và chờ workflow chạy xong

---

## 5) Kiểm tra biến thể URL (đặc biệt quan trọng)
ES Modules dùng path tương đối nên thường hoạt động tốt.

### 5.1 Nếu truy cập dạng `https://<user>.github.io/<repo>/`
- Vì ta publish từ `web/`, `index.html` sẽ là root của Pages artifact.
- Khi đó đường dẫn script hiện trong `web/index.html` là:
  - `<script type="module" src="js/main.js?v=3.2"></script>`
- GitHub Pages sẽ map `js/main.js` tương ứng `web/js/main.js` => **đúng**.

### 5.2 Nếu bạn dùng custom domain
- Không ảnh hưởng code hiện tại.

---

## 6) Build/Deploy thủ công (phương án thay thế)
Nếu muốn deploy thủ công không cần workflow:

### 6.1 Dùng branch `gh-pages`
1. Tạo branch `gh-pages`.
2. Copy toàn bộ nội dung thư mục `web/` vào root branch `gh-pages`.
3. Commit + push.
4. Vào **Settings → Pages** → Source chọn **gh-pages** branch.

Cách này đơn giản nhưng tốn công thao tác thủ công.

---

## 7) Những lỗi thường gặp & cách xử lý
1. **Trang trắng / lỗi module CORS**
   - Ensure Pages chạy qua HTTPS (GitHub Pages mặc định là HTTPS).
   - Ensure file `js/main.js` tồn tại trong publish folder.

2. **404 cho `style.css` hoặc `js/main.js`**
   - Kiểm tra Pages artifact có đúng “publish directory” là `web/`.

3. **Cache cũ (do query `?v=3.2`)**
   - Trong code đã có query version nên cache thường đỡ bị “kẹt”.

---

## 8) Checklist trước khi push final
- [ ] `web/index.html` mở được local
- [ ] Có commit `web/` đầy đủ
- [ ] Workflow publish đúng `PUBLISH_DIR: web`
- [ ] Pages được chọn “GitHub Actions”

---

## 9) Kết quả mong đợi
Sau khi workflow chạy xong, Pages sẽ hiện link dạng:
- `https://<tên_user>.github.io/<tên_repo>/`
- Hoặc `https://<tên_user>.github.io/` (tùy repo).

Nội dung site sẽ hiển thị dashboard mô phỏng và chạy ES Modules bình thường.
