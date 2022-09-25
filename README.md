# Registration management service

<p align="center">
 <img src="./public/logo_2.png" height = "200"></a>
</p>

<p align="center">
<i>Đây là một dự án dùng để quản lý các services</i>

</p>

**Registration management service** là ứng dụng quản lý các service giúp việc theo dõi, quản lý các service được trực quan và hiệu quả, tiện lợi hơn so với cách làm trước đây.

---

## **📝 Mục lục**

- [Registration management service](#registration-management-service)
  - [**📝 Mục lục**](#-mục-lục)
  - [**Cài đặt**](#cài-đặt)
    - [**Dành cho việc phát triển ứng dụng:**](#dành-cho-việc-phát-triển-ứng-dụng)
  - [**Tính năng**](#tính-năng)
    - [**Quản lý service**](#quản-lý-service)
    - [**Quản lý ví**](#quản-lý-ví)
    - [**Quản lý các giao dịch**](#quản-lý-các-giao-dịch)
    - [**Quản lý các giao dịch vay và cho vay**](#quản-lý-các-giao-dịch-vay-và-cho-vay)
    - [**Thống kê chi tiêu**](#thống-kê-chi-tiêu)
    - [**Quản lý ngân sách**](#quản-lý-ngân-sách)
    - [**Quản lý chi tiêu sự kiện**](#quản-lý-chi-tiêu-sự-kiện)
    - [**Quản lý hóa đơn**](#quản-lý-hóa-đơn)
    - [**Quản lý các giao dịch tự động**](#quản-lý-các-giao-dịch-tự-động)
    - [**Thay đổi giao diện ứng dụng**](#thay-đổi-giao-diện-ứng-dụng)
    - [**Hướng dẫn và trợ giúp người dùng**](#hướng-dẫn-và-trợ-giúp-người-dùng)
    - [**Truy cập liên kết**](#truy-cập-liên-kết)
  - [**Thư viện và Công nghệ**](#thư-viện-và-công-nghệ)
  - [**Thành viên đóng góp**](#thành-viên-đóng-góp)

## **Cài đặt**

### **Dành cho việc phát triển ứng dụng:**

Yêu cầu:

- Thiết bị được cài đặt sẵn NodeJS(Phiên bản 16 trở lên)
- Phù hợp nhất với các phiên bản Node LTS 16.17.0

Đối với frontend

```bash
  cd service-management-system-fe

  // Cài đặt các dependencies
  yarn
  hoặc
  npm install

  // Chạy ứng dụng
  yarn
  hoặc
  npm start
```

Đối với backend

```bash
  cd services-management-be

  // Cài đặt các dependencies
  yarn
  hoặc
  npm install

  // Chạy ứng dụng
  yarn
  hoặc
  npm start
```

- Tài khoản mặc định
  - Username: admin
  - Password: 123456789

## **Tính năng**

### **Quản lý service**

- Thêm, xóa, sửa các service
  - Thêm service có thể sửa bằng form hoặc sửa bằng file JSON
  - Có thể chọn service từ màn hình chính sau đó thực hiện sửa và xóa
  - Sửa service có thể sửa bằng form hoặc sửa bằng file JSON
- Kiểm tra các dependencies vòng khi thêm xóa sửa(Nếu có)

### **Quản lý ví**

- Thêm, sửa, xóa, hiển thị ví.
- Chỉnh sửa số tiền đang có trong ví.

### **Quản lý các giao dịch**

- Thêm, sửa, xóa, hiển thị giao dịch.
- Xem thông tin chi tiết giao dịch.
- Tìm kiếm giao dịch.
- Tùy chọn hiển thị giao dịch theo các khoảng thời gian.
- Tùy chọn hiển thị giao dịch theo thể loại/thời gian.

### **Quản lý các giao dịch vay và cho vay**

- Thêm liên hệ đã vay/cho vay.
- Tính toán lượng tiền cần phải trả nợ/thu nợ.
- Tạo nhanh giao dịch trả nợ/thu nợ cho giao dịch vay/cho vay.

### **Thống kê chi tiêu**

- Thống kê chi tiêu dưới dạng biểu đồ cột và biểu đồ tròn.
- Tùy chọn thống kê theo các mốc thời gian.
- Hiển thị chi tiết thống kê bao gồm:
  - Lượng tiền giao dịch trong một khoảng thời gian xác định (đối với biểu đồ cột).
  - Tỉ lệ thu chi theo danh mục (đối với biểu đồ tròn).
- Danh sách các giao dịch của từng biểu đồ.
  - Có thể sửa, xóa, hiển thị thông tin chi tiết của giao dịch ngay tại phần danh sách các giao dịch của biểu đồ.
- Lưu/chia sẻ biểu đồ thống kê dưới dạng hình ảnh.

### **Quản lý ngân sách**

- Thêm, sửa, xóa, hiển thị ngân sách.
- Hiển thị thông tin chi tiết ngân sách.
- Thống kê, tính toán với biểu đồ đường:
  - Tính toán lượng tiền tối đa có thể chi trong một ngày để không bị vượt quá ngân sách.
  - Tính toán lượng tiền thực tế đã chi trong một ngày.
  - Tính toán lượng tiền kỳ vọng vào cuối kỳ dựa trên lượng tiền đã chi thực tế hiện tại.
- Danh sách các giao dịch nằm trong ngân sách.
  - Có thể sửa, xóa, hiển thị thông tin chi tiết của giao dịch ngay tại phần danh sách các giao dịch của ngân sách.
- Cho phép cài đặt lặp lại ngân sách vào kỳ tiếp theo.

### **Quản lý chi tiêu sự kiện**

- Thêm, sửa, xóa, hiển thị sự kiện.
- Hiển thị thông tin chi tiết sự kiện.
- Danh sách các giao dịch đã thực hiện trong sự kiện.
  - Có thể sửa, xóa, hiển thị thông tin chi tiết của giao dịch ngay tại phần danh sách các giao dịch của sự kiện.

### **Quản lý hóa đơn**

- Thêm, sửa, xóa, hiển thị hóa đơn.
- Hiển thị thông tin chi tiết hóa đơn.
- Hiển thị các hóa đơn cần phải trả.
- Tùy chọn lặp lại cho hóa đơn (việc lặp lại được thực hiện tự động):
  - Có thể tùy chỉnh thời gian bắt đầu.
  - Có thể tùy chỉnh lặp lại sau một số lượng ngày, tuần, tháng hoặc năm xác định.
  - Có thể tùy chỉnh kiểu lặp lại với các tùy chọn sau:
    - Không kết thúc việc lặp lại.
    - Kết thúc lặp lại vào một ngày xác định.
    - Kết thúc sau một số lượng lần xác định.
- Thực hiện tạo giao dịch cho hóa đơn (trả hóa đơn).
- Cho phép lập tức kết thúc việc lặp lại hóa đơn.
- Danh sách các giao dịch nằm trong ngân sách.
  - Có thể sửa, xóa, hiển thị thông tin chi tiết của giao dịch ngay tại phần danh sách các giao dịch của hóa đơn.

### **Quản lý các giao dịch tự động**

- Thêm, sửa, xóa, hiện thị các giao dịch tự động.
- Hiển thị thông tin chi tiết giao dịch tự động.
- Tùy chọn lặp lại cho giao dịch tự động (việc lặp lại được thực hiện tự động):
  - Có thể tùy chỉnh thời gian bắt đầu.
  - Có thể tùy chỉnh lặp lại sau một số lượng ngày, tuần, tháng hoặc năm xác định.
  - Có thể tùy chỉnh kiểu lặp lại với các tùy chọn sau:
    - Không kết thúc việc lặp lại.
    - Kết thúc lặp lại vào một ngày xác định.
    - Kết thúc sau một số lượng lần xác định.
- Thực hiện tạo giao dịch thủ công cho giao dịch tự động.

### **Thay đổi giao diện ứng dụng**

- Cho phép thay đổi màu chữ, màu nền của ứng dụng theo các gói đã được tạo sẵn:
  - Black Theme.
  - White Theme.
  - Grey Theme.

### **Hướng dẫn và trợ giúp người dùng**

- Phần trợ giúp sẽ bao gồm phần trả lời các câu hỏi cơ bản và hướng dẫn sử dụng một số tính năng cho người dùng.
- Cho phép người dùng gửi mail phản hồi/ báo lỗi đến nhóm phát triển ứng dụng.

### **Truy cập liên kết**

- Truy cập tới trang github của ứng dụng.
- Truy cập tới các trang cá nhân trên mạng xã hội cũng như email của các thành viên trong nhóm.

## **Thư viện và Công nghệ**

- [Flutter](https://flutter.dev/).
- [Firebase](https://firebase.google.com/).
- [Pub.dev](https://pub.dev/).

## **Thành viên đóng góp**

- Trần Lê Thanh Tùng _(TungTLT)_: 19522496@gm.uit.edu.vn
- Dương Hiển Thế _(hacThe)_: 19522252@gm.uit.edu.vn
- Huỳnh Trọng Phục _(Phuc-HuynhTrong)_: 19522030@gm.uit.edu.vn
- Trương Kim Lâm _(ltk84)_: 19521743@gm.uit.edu.vn

<br/>

<h4 align="center">
<a href="https://github.com/ltk84/QuanLyKhuCachLy/graphs/contributors">
<img src="https://contrib.rocks/image?repo=ltk84/QuanLyKhuCachLy" />
</a>

<br/>
