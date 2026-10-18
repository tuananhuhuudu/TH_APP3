# Bài thực hành 3 - Ứng dụng quản lý học tập

Ứng dụng React Native hỗ trợ sinh viên quản lý môn học, thời khoá biểu, bài tập
và kết quả học tập.

## Chức năng

| Màn hình | Chức năng |
| --- | --- |
| Tổng quan | Hiển thị họ tên, mã sinh viên, thống kê nhanh, bài tập sắp đến hạn và môn học đang học |
| Môn học | Danh sách môn học bằng `FlatList`, tìm kiếm theo tên hoặc mã môn |
| Thời khoá biểu | Lịch học theo từng thứ trong tuần, hiển thị môn học, thời gian và phòng |
| Bài tập | Danh sách bài tập kèm hạn nộp, lọc theo trạng thái, cập nhật trạng thái hoàn thành |
| Cá nhân | Thông tin sinh viên, chỉnh sửa họ tên / email / số điện thoại, bảng kết quả học tập |

Các màn hình chi tiết mở bằng Stack Navigation: chi tiết môn học, chi tiết buổi
học, chi tiết bài tập và chi tiết kết quả học tập.

## Cấu trúc thư mục

```
src/
  components/   Thành phần giao diện dùng chung (card, badge, input, ...)
  data/         Dữ liệu mẫu và AppContext quản lý state chung
  navigation/   Bottom Tab Navigator, Native Stack Navigator và kiểu dữ liệu route
  screens/      5 màn hình chính và 4 màn hình chi tiết
  types/        Định nghĩa kiểu dữ liệu
  utils/        Hàm tiện ích và theme
```

## Kỹ thuật sử dụng

- React Native 0.87 với TypeScript.
- React Navigation: `Bottom Tab Navigator` lồng trong `Native Stack Navigator`.
- `FlatList` cho mọi danh sách, có xử lý trạng thái rỗng.
- `useState`, `useEffect`, `useMemo`, `useCallback` và Context API.
- `AsyncStorage` lưu trạng thái bài tập và thông tin cá nhân đã chỉnh sửa.

## Chạy ứng dụng

```bash
npm install
npm start          # khởi động Metro
npm run android    # chạy trên Android
npm run ios        # chạy trên iOS
```
