# Auto-Post Tool - TimeDealer

Công cụ tự động lên lịch đăng bài lên TimeDealer. Tool sẽ lên lịch 288 bài viết, cứ 5 phút một bài, cho đến 12h trưa hôm sau.

---

## 📥 Cài đặt (Lần đầu)

### Bước 1: Cài Node.js

1. Vào https://nodejs.org/
2. Tải phiên bản **LTS** (khuyến nghị)
3. Chạy file cài đặt, chọn "Next" hết
4. Kiểm tra: Mở Command Prompt (PowerShell) gõ:
   ```
   node --version
   npm --version
   ```
   Nếu hiện số phiên bản = cài đặt thành công ✓

### Bước 2: Cài Git (tùy chọn, chỉ cần tải repo)

1. Vào https://git-scm.com/
2. Tải file cài đặt
3. Chạy file, chọn "Next" hết

### Bước 3: Tải tool

**Cách 1 - Dùng Git (dễ update sau):**
```
git clone https://github.com/helloVietTran/auto-click-tool.git
cd auto-post-tool
npm install
```

**Cách 2 - Tải file ZIP:**
- Tải project từ GitHub → giải nén
- Mở Command Prompt trong thư mục `auto-post-tool`
- Gõ: `npm install`

---

## ⚙️ Cấu hình

### 1. Mở file `src/config.js`

Sửa thông tin của bạn:

```javascript
const config = {
  username: "0912345678",        // Số điện thoại TimeDealer
  password: "mật_khẩu_của_bạn",  // Mật khẩu
  region: "Vietnam+",             // Khu vực (VD: "Hong Kong SAR China")
  title: "Tiêu đề bài viết",
  message: "Nội dung bài viết..."
};
```

### 2. Chuẩn bị ảnh

- Đặt ảnh vào thư mục `src/`
- **Đổi tên thành: `content_img.jpeg`** (bắt buộc)

Cấu trúc thư mục:
```
auto-post-tool/
├── src/
│   ├── autoPost.js
│   ├── config.js
│   └── content_img.jpeg  ← ảnh ở đây
```

---

## 🚀 Chạy tool

Mở Command Prompt (PowerShell) trong thư mục `auto-post-tool`, gõ:

```
node src/autoPost.js
```

Tool sẽ:
- Đăng nhập tự động
- Lên lịch 288 bài đăng (5 phút/1 bài)
- Dừng lúc 12h trưa hôm sau

---

## ⚠️ Lưu ý

- **Không chia sẻ file `config.js`** (chứa mật khẩu)
- Giữ kết nối internet ổn định
- Trình duyệt sẽ mở để bạn theo dõi quá trình
- Nếu không có ảnh, tool vẫn chạy (chỉ không đăng ảnh)
