# 🎲 TTK Probability | Educational Simulation Suite

[![Version](https://img.shields.io/badge/version-3.2-blue.svg)](https://github.com/ryantr-statinops/simulator_propability_web)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tech](https://img.shields.io/badge/tech-Vanilla%20JS-yellow.svg)](#)

**TTK Probability** là một bộ công cụ web cao cấp được thiết kế để trực quan hóa các khái niệm xác suất và thống kê phức tạp một cách trực quan và sinh động. Dự án tập trung vào việc minh họa **Luật số lớn (Law of Large Numbers)** và **Định lý giới hạn trung tâm (Central Limit Theorem)** thông qua các mô phỏng thời gian thực.

---

## 💎 Giao diện Ứng dụng

![Link Website](https://ryantr-statinops.github.io/Grap4Prob/)
*Giao diện hiện đại với phong cách Glassmorphism và Dark Mode.*

---

## ✨ Tính năng nổi bật

Ứng dụng cung cấp một loạt các module mô phỏng đa dạng:

- **🎲 Xúc xắc & Đồng xu**: Minh họa cơ bản về xác suất rời rạc và sự hội tụ tần suất.
- **🃏 Bộ bài (Cards)**: Mô phỏng rút bài ngẫu nhiên.
- **🎱 Rút bi (Urn Model)**: Bài toán xác suất có hoàn lại và không hoàn lại.
- **🚪 Monty Hall Paradox**: Trực quan hóa nghịch lý nổi tiếng trong xác suất điều kiện.
- **🎂 Bài toán Ngày sinh (Birthday Paradox)**: Khám phá xác suất trùng lặp trong nhóm người.
- **🪡 Kim Buffon**: Ước tính số Pi (π) thông qua phương pháp Monte Carlo.
- **🛝 Bàn Galton**: Minh họa trực quan về Phân phối chuẩn (Normal Distribution).
- **🤖 AI Insights**: Tự động đưa ra nhận định và phân tích dữ liệu sau mỗi lần mô phỏng.

---

## 🛠️ Công nghệ sử dụng

Dự án được xây dựng với tiêu chí nhẹ, nhanh và hiện đại:

- **Frontend**: HTML5 Semantic, CSS3 (Custom Design System, CSS Variables).
- **Logic**: Vanilla JavaScript (ES6+ Modules).
- **Visualization**: [Chart.js](https://www.chartjs.org/) cho các biểu đồ phân phối và đường hội tụ.
- **Aesthetics**: Glassmorphism, Smooth Animations, Responsive Design.

---

## 🚀 Hướng dẫn cài đặt và sử dụng

Vì dự án sử dụng **ES Modules**, bạn cần chạy qua một web server hoặc mở bằng các trình duyệt hiện đại.

1. **Clone repository:**
   ```bash
   git clone https://github.com/ryantr-statinops/simulator_propability_web.git
   ```

2. **Chạy ứng dụng:**
   - Sử dụng extension **Live Server** trên VS Code (Chuột phải vào `web/index.html` -> `Open with Live Server`).
   - Hoặc sử dụng bất kỳ static server nào (như `python -m http.server`, `npx serve`, v.v.).

3. **Truy cập:**
   Mở trình duyệt và truy cập vào địa chỉ server (thường là `http://localhost:5500/web/index.html`).

---

## 📊 Cấu trúc dự án

```text
/
├── web/
│   ├── index.html      # Giao diện chính
│   ├── style.css       # Hệ thống Design System & Styles
│   ├── js/
│   │   ├── main.js     # Entry point & Điều hướng
│   │   ├── simulation.js # Logic tính toán xác suất
│   │   └── ui.js       # Xử lý DOM & Biểu đồ Chart.js
│   └── agent/          # (Optional) Logic AI Insights
└── README.md           # Tài liệu dự án
```

---

## 📝 Giấy phép

Dự án này được phát hành dưới giấy phép [MIT](LICENSE). Tự do sử dụng cho mục đích học tập và nghiên cứu.

---

*Phát triển bởi **TTK-AI Team** | Visualizing the beauty of mathematics.*
