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
    - [**Hiển thị service**](#hiển-thị-service)
  - [**Thư viện và Công nghệ**](#thư-viện-và-công-nghệ)

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
  - Thêm service có thể sửa bằng form hoặc sửa bằng file JSON.
  - Có thể chọn service từ màn hình chính sau đó thực hiện sửa và xóa
  - Sửa service có thể sửa bằng form hoặc sửa bằng file JSON
  - Thêm và chỉnh sửa bằng JSON có check tính đúng đắn và có thể chỉnh sửa dễ dàng hơn với lựa chọn JSON Editor ở trên tab navigation
- Kiểm tra các dependencies vòng khi thêm xóa sửa(Nếu có)

### **Hiển thị service**

- Hiển thị tất cả các service:
  - Có thể chọn các service ở tab bên trái sau đó chọn để hiển thị từng service
  - Ở màn hình chính, khi chọn cụ thể service thì có thể chọn chế độ xem, hình dạng của tổng thể các service(cây hoặc đồ thị)
  - Ở các chế độ xem
    - Phóng to, thu nhỏ bằng cách lăn chuột
    - Chọn service để xem chi tiết service
  - Ở chế độ xem đồ thị:
    - Có thể download đồ thị hiện tại
    - Có thể kéo thả các node biểu thị các service
  - Có thể xem với các loại phụ thuộc
    - Own Dependencies: Những service mà service hiện tại đang phụ thuộc
    - Dependencies: Những service đang phụ thuộc vào service hiện tại
- Tìm kiếm các services:
  - Có thể tìm kiếm và xem các service theo tên

## **Thư viện và Công nghệ**

MERN Stack

- [ReactJS](https://reactjs.org/).
- [NodeJS](https://nodejs.org/en/).
- [MongoDB](https://www.mongodb.com/).
- [ExpressJS](https://expressjs.com/).
