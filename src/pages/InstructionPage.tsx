export function InstructionPage() {
  return (
    <section className="card instruction-page">
      <h1>Hướng Dẫn Sử Dụng</h1>
      <p className="helper-text">
        Vui lòng đọc kỹ trước khi gửi link và tải ảnh minh chứng để quá trình xác minh diễn ra
        thuận lợi.
      </p>

      <ol className="instruction-list">
        <li>
          <strong>Định danh người dùng (uid)</strong>
          <p>
            Luôn mở ứng dụng kèm tham số <code>?uid=mã_của_bạn</code> trên URL. Hệ thống lưu uid
            trên trình duyệt để các lần sau không cần nhập lại (nếu bạn vẫn dùng cùng thiết bị và
            trình duyệt).
          </p>
        </li>
        <li>
          <strong>Gửi link Shopee</strong>
          <p>
            Tại trang <em>Gửi Link</em>, dán link sản phẩm Shopee hợp lệ rồi bấm Gửi. Chờ thông báo
            thành công hoặc thông báo lỗi từ hệ thống.
          </p>
        </li>
        <li>
          <strong>Theo dõi lịch sử</strong>
          <p>
            Trang <em>Lịch Sử</em> hiển thị các link đã gửi, trạng thái xử lý và thời gian. Trang
            tự làm mới định kỳ để bạn thấy cập nhật mới nhất.
          </p>
          <p>
            Giải thích trạng thái: <strong>Đang xử lý</strong> - đang trong quá trình xử lý link;{' '}
            <strong>Hoàn tất link</strong> - link đã được chuyển đổi thành công;{' '}
            <strong>Đã đặt hàng</strong> - bạn đã đặt hàng thành công; <strong>Đã hoàn thành</strong>{' '}
            - đơn hàng thành công, hoa hồng sẽ được thanh toán.
          </p>
        </li>
        <li>
          <strong>Chi tiết đơn và minh chứng</strong>
          <p>
            Mở <em>Xem chi tiết</em> để xem đầy đủ link sản phẩm, link affiliate (khi đã có), và
            tải ảnh minh chứng theo từng mục: ảnh đơn hàng đã đặt và ảnh chứng minh đơn hàng thành
            công. Ảnh chỉ dùng để xác minh; đội ngũ admin sẽ kiểm tra thủ công.
          </p>
          <p>
            Khi bạn đặt hàng xong, hãy upload ảnh minh chứng cho đơn hàng (ví dụ: ảnh chụp màn hình
            thông tin đơn trong ứng dụng). Khi đơn hàng được giao thành công, hãy chụp thêm ảnh minh
            chứng đã giao và upload vào mục ảnh đơn hàng thành công.
          </p>
        </li>
        <li>
          <strong>Quy định chống gian lận</strong>
          <p>
            Nghiêm cấm mọi hành vi gian lận dưới bất kỳ hình thức nào (ảnh giả, sửa ảnh, gửi sai đơn,
            tự tạo đơn không hợp lệ...). Nếu phát hiện gian lận, hệ thống sẽ xóa hoa hồng của đơn hàng
            liên quan và có thể từ chối các đợt duyệt tiếp theo.
          </p>
        </li>
        <li>
          <strong>Hoa hồng (tham khảo)</strong>
          <p>
            Phần tính tiền hoa hồng trên trang chi tiết chỉ mang tính ước lượng theo giá trị đơn và
            tỷ lệ bạn nhập. Số tiền thực tế phụ thuộc kết quả xác minh và chính sách áp dụng.
          </p>
        </li>
      </ol>

      <p className="instruction-footer-note">
        Mọi thắc mắc vui lòng liên hệ qua kênh Zalo được cấu hình trong ứng dụng (xem chân trang).
      </p>
    </section>
  )
}
