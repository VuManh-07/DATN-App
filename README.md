# DATN App

Electron + React + TypeScript desktop skeleton, built with Electron Forge and
Webpack. The build configuration mirrors `Coldwallet-appdesktop`, so anything
learned there applies here unchanged.

## Chạy

```bash
yarn install
yarn start      # dev server on :3040, logger on :9040
```

| Lệnh | Việc |
| --- | --- |
| `yarn start` | Chạy dev với hot reload |
| `yarn lint` | ESLint trên `.ts` / `.tsx` |
| `yarn package` | Đóng gói app, không tạo installer |
| `yarn make` | Tạo installer (Squirrel / deb / rpm / zip) |

## Cấu hình

`.env` (gitignored) là nguồn cấu hình; `.env.example` là bản mẫu có chú thích.

Hai đường đọc env, **đừng nhầm**:

- **Main process** đọc `process.env` trực tiếp qua `process/config.ts`. Thêm
  biến nào cũng được, kể cả thứ nhạy cảm.
- **Renderer** không có `process.env` lúc chạy. Chỉ những biến liệt kê trong
  `RENDERER_ENV` (`webpack.plugins.ts`) mới được `DefinePlugin` thay thành
  chuỗi literal lúc build — tức **ai cầm bản build đều đọc được**. Chỉ để
  endpoint và định danh công khai ở đó.

## Cấu trúc

```
process/
  config.ts              cấu hình runtime từ .env (main process)
  electron/
    main.ts              tạo BrowserWindow, vòng đời app
    ipc.ts               các handler IPC
    preload.ts           cầu nối duy nhất renderer được dùng
src/
  index.tsx              mount React
  app.tsx                app shell
  @type/preload.d.ts     kiểu cho window.Main
  styles/global.scss
public/index.html        HTML entry của renderer
```

## Hai điểm dễ vấp

**CSP.** `devContentSecurityPolicy` trong `forge.config.ts` phải liệt kê mọi
host renderer gọi tới. Bị chặn thì request **không** báo lỗi mạng — nó trông
y hệt một phản hồi rỗng. Thêm host cùng lúc với code gọi nó.

**Không ghi file vào `.webpack/`.** Dev server theo dõi thư mục đó; ghi vào là
nó rebuild và reload renderer, state trong bộ nhớ mất sạch. Dữ liệu ghi lúc
chạy phải nằm ở `app.getPath("userData")`.

## Native module

Chưa có. Khi thêm: khai trong `externals` của `webpack.main.config.ts`, bỏ
`rebuildConfig: { onlyModules: [] }` trong `forge.config.ts`, và bọc `require`
bằng guard để máy không có toolchain vẫn build được.
