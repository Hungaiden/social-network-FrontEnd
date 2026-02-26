# Social Network — Frontend

Giao diện người dùng cho một mạng xã hội, xây dựng với **Next.js 16**, **React 19** và **TypeScript**. Ứng dụng hỗ trợ đăng nhập, xem bảng tin, quản lý bạn bè và nhắn tin thời gian thực.

---

## Tính năng

- **Xác thực** — Đăng nhập bằng JWT, tự động đính kèm token vào mỗi request, tự động chuyển hướng khi token hết hạn.
- **Bảng tin (Timeline)** — Xem, tạo bài đăng theo dạng feed phân trang.
- **Bạn bè** — Gửi/nhận lời mời kết bạn, xem danh sách bạn bè.
- **Nhắn tin thời gian thực** — Chat qua WebSocket (STOMP over SockJS), hỗ trợ nhiều cuộc hội thoại và tạo nhóm chat.
- **Hồ sơ cá nhân** — Xem và chỉnh sửa thông tin tài khoản.
- **Giao diện** — Responsive, hỗ trợ dark/light mode, được xây dựng trên shadcn/ui và Radix UI.

---

## Công nghệ sử dụng

| Nhóm            | Thư viện / Công cụ                            |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                       |
| UI              | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Ngôn ngữ        | TypeScript 5                                  |
| HTTP Client     | Axios                                         |
| Form            | React Hook Form + Zod                         |
| WebSocket       | @stomp/stompjs + sockjs-client                |
| Biểu đồ         | Recharts                                      |
| Package Manager | pnpm                                          |

---

## Cấu trúc thư mục

```
├── app/                    # Next.js App Router
│   ├── api/auth/login/     # Route handler đăng nhập
│   ├── dashboard/          # Các trang sau khi đăng nhập
│   │   ├── timeline/       # Bảng tin
│   │   ├── friends/        # Bạn bè
│   │   ├── messages/       # Tin nhắn
│   │   └── profile/        # Hồ sơ cá nhân
│   └── login/              # Trang đăng nhập
├── components/
│   ├── dashboard/          # Các component chính của ứng dụng
│   ├── auth/               # Component xác thực
│   └── ui/                 # Thư viện component dùng chung (shadcn/ui)
├── services/               # Lớp gọi API
│   ├── authService.ts
│   ├── postService.ts
│   ├── friendService.ts
│   └── conversationService.ts
├── lib/
│   ├── api.ts              # Cấu hình Axios (interceptors, base URL)
│   ├── websocket.ts        # WebSocket service (STOMP)
│   └── user-context.tsx    # React Context cho user hiện tại
└── hooks/                  # Custom hooks
```

---

## Yêu cầu

- Node.js >= 18
- pnpm >= 9
- Backend API đang chạy tại `http://localhost:8080` (có thể thay đổi qua biến môi trường)

---

## Cài đặt & Chạy

```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Tạo file biến môi trường
cp .env.example .env.local
# Chỉnh sửa NEXT_PUBLIC_API_URL nếu backend chạy ở địa chỉ khác

# 3. Chạy development server
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

---

## Biến môi trường

| Biến                  | Mặc định                       | Mô tả                    |
| --------------------- | ------------------------------ | ------------------------ |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | Địa chỉ backend REST API |

---

## Scripts

```bash
pnpm dev      # Khởi động server phát triển
pnpm build    # Build production
pnpm start    # Chạy bản build production
pnpm lint     # Kiểm tra lỗi lint
```

---

## Xác thực

Ứng dụng sử dụng JWT bearer token:

1. Sau khi đăng nhập thành công, token được lưu vào `localStorage` với key `access_token`.
2. Axios interceptor tự động đính kèm token vào header `Authorization` của mọi request.
3. Khi nhận response `401`, token bị xóa và người dùng được chuyển về trang `/login`.

---

## WebSocket

Kết nối real-time được thiết lập qua **STOMP over SockJS** tới `ws://localhost:8080/ws`:

- Token JWT được gửi trong `connectHeaders` khi kết nối.
- Subscribe channel `/user/queue/messages` để nhận tin nhắn mới.
- Tự động reconnect sau 5 giây nếu mất kết nối.
