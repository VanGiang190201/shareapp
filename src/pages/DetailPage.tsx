import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Toast } from '../components/Toast'
import { uploadHistoryImage } from '../services/api'
import { useAppSelector } from '../store/hooks'
import { useAppDispatch } from '../store/hooks'
import { setSelectedRecord } from '../store/historySlice'

export function DetailPage() {
  const dispatch = useAppDispatch()
  const record = useAppSelector((state) => state.history.selectedRecord)
  const [orderImage, setOrderImage] = useState<{ file: File; preview: string } | null>(null)
  const [successImage, setSuccessImage] = useState<{ file: File; preview: string } | null>(null)
  const [uploadingType, setUploadingType] = useState<'image' | 'success' | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const productPrice = record?.productPrice?.toString() ?? ''
  const orderImageFromRecord = record?.image
  const successImageFromRecord = record?.imageSuccess

  useEffect(() => {
    return () => {
      if (orderImage?.preview) {
        URL.revokeObjectURL(orderImage.preview)
      }
      if (successImage?.preview) {
        URL.revokeObjectURL(successImage.preview)
      }
    }
  }, [orderImage, successImage])

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (orderImage?.preview) {
      URL.revokeObjectURL(orderImage.preview)
    }
    setOrderImage({ file, preview: URL.createObjectURL(file) })
    event.target.value = ''
  }

  function handleSuccessOrderImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (successImage?.preview) {
      URL.revokeObjectURL(successImage.preview)
    }
    setSuccessImage({ file, preview: URL.createObjectURL(file) })
    event.target.value = ''
  }

  function removeSelectedImage(type: 'image' | 'success') {
    if (type === 'image') {
      if (orderImage?.preview) {
        URL.revokeObjectURL(orderImage.preview)
      }
      setOrderImage(null)
      return
    }

    if (successImage?.preview) {
      URL.revokeObjectURL(successImage.preview)
    }
    setSuccessImage(null)
  }

  async function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'))
      reader.readAsDataURL(file)
    })
  }

  async function uploadImage(type: 'image' | 'success') {
    if (!record?.requestId) {
      setToast({ message: 'Thiếu requestId, không thể gửi ảnh.', type: 'error' })
      return
    }

    const selected = type === 'image' ? orderImage : successImage
    if (!selected) {
      setToast({ message: 'Vui lòng chọn 1 ảnh trước khi gửi.', type: 'error' })
      return
    }

    setUploadingType(type)
    try {
      const base64 = await toBase64(selected.file)
      const res = await uploadHistoryImage(record.requestId, base64, type, record.time)
      dispatch(setSelectedRecord({...record, image: res.url}))
      setToast({ message: 'Gửi ảnh thành công.', type: 'success' })
      removeSelectedImage(type)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Gửi ảnh thất bại.',
        type: 'error',
      })
    } finally {
      setUploadingType(null)
    }
  }

  const amount = Number(productPrice) || 0
  const commissionRate = record?.commissionRate ?? 0
  const rate = commissionRate
  const affiliateMoney = (amount * rate) / 100
  const canShowCommission =
    record?.status === 'WAIT_ORDER' || record?.status === 'DONE_ORDER' || record?.status === 'DONE'
  const statusLabelMap = {
    WAIT_LINK: 'Đang xử lý',
    DONE: 'Hoàn tất link',
    WAIT_ORDER: 'Đã đặt hàng',
    DONE_ORDER: 'Đã hoàn thành',
  } as const
  const statusLabel = statusLabelMap[record?.status ?? 'WAIT_LINK']

  if (!record) {
    return (
      <section className="card">
        <h1>Chi Tiết</h1>
        <p className="error-text">
          Dữ liệu chi tiết không hợp lệ. Vui lòng quay lại lịch sử và mở lại chi tiết.
        </p>
      </section>
    )
  }

  function formatTime(value: string) {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString()
  }

  function formatCurrencyVnd(value: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section className="card">
      <h1>Thông Tin Chi Tiết</h1>

      <div className="detail-grid">
        <div className="detail-item">
          <p className="detail-label">Link Sản Phẩm</p>
          <a href={record.link} target="_blank" rel="noreferrer">
            {record.link}
          </a>
        </div>
        <div className="detail-item">
          <p className="detail-label">Link Affiliate</p>
          {record.affiliate ? (
            <a href={record.affiliate} target="_blank" rel="noreferrer">
              {record.affiliate}
            </a>
          ) : (
            <span>-</span>
          )}
        </div>
        <div className="detail-item">
          <p className="detail-label">Trạng Thái</p>
          <span className="status-inline">{statusLabel}</span>
        </div>
        <div className="detail-item">
          <p className="detail-label">Thời Gian</p>
          <span>{formatTime(record.time) || '-'}</span>
        </div>
      </div>

      <section className="detail-section">
        <h2>Tải Ảnh Đơn Đặt Hàng</h2>
        <p className="detail-note">
          Tải ảnh để chứng minh đơn hàng đã được đặt thành công bằng cách chụp thông tin đơn hàng,
          quá trình xác minh sẽ được thực hiện thủ công bởi đội ngũ nhân viên, hoa hồng sẽ được cập
          nhật ngay khi xác nhận.
        </p>
        <input
          id="order-images"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploadingType === 'image'}
        />
        {orderImageFromRecord && (
          <div className="existing-image-wrap">
            <p className="detail-label">Ảnh hiện tại đã lưu</p>
            <div className="image-grid">
              <div className="image-card">
                <img src={orderImageFromRecord} alt="Ảnh đơn hàng đã lưu" />
              </div>
            </div>
          </div>
        )}
        {orderImage && (
          <>
            <p className="detail-label">Ảnh mới đã chọn (sẽ dùng để cập nhật)</p>
            <div className="image-grid">
              <div className="image-card">
                <img src={orderImage.preview} alt="Ảnh đơn hàng" />
                <button
                  type="button"
                  className="image-remove-button"
                  onClick={() => removeSelectedImage('image')}
                  disabled={uploadingType === 'image'}
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="upload-actions">
              <button
                type="button"
                onClick={() => void uploadImage('image')}
                disabled={uploadingType === 'image'}
              >
                {uploadingType === 'image' ? 'Đang gửi ảnh...' : 'Gửi ảnh đơn đặt hàng'}
              </button>
            </div>
          </>
        )}
      </section>


      <section className="detail-section">
        <h2>Tính Tiền Hoa Hồng Affiliate</h2>
        {canShowCommission ? (
          <>
            <div className="calc-grid">
              <label htmlFor="order-amount">Giá Trị Đơn Hàng</label>
              <input
                id="order-amount"
                type="number"
                min="0"
                step="0.01"
                readOnly
                value={productPrice}
                placeholder="0"
              />

              <label htmlFor="commission-rate">Tỷ Lệ Hoa Hồng (%)</label>
              <input
                id="commission-rate"
                type="number"
                min="0"
                step="0.01"
                value={commissionRate}
                readOnly
                placeholder="0"
              />
            </div>
            <p className="calc-result">Tiền hoa hồng ước tính: {formatCurrencyVnd(affiliateMoney)}</p>
          </>
        ) : (
          <p className="detail-note">
            Hoa hồng chỉ hiển thị khi bạn đã đặt thành công giá trị hiển thị hoa hồng đã là 60% hoa hồng của bạn.
          </p>
        )}
      </section>

      <section className="detail-section">
        <h2>Tải Ảnh Đơn Hàng Thành Công</h2>
        <p className="detail-note">
          Tải ảnh để chứng minh đơn hàng đã được nhận thành công bằng cách chụp thông tin đơn hàng, quá
          trình xác minh sẽ được thực hiện thủ công bởi đội ngũ nhân viên.
        </p>
        <input
          id="success-order-images"
          type="file"
          accept="image/*"
          onChange={handleSuccessOrderImagesChange}
          disabled={uploadingType === 'success'}
        />
        {successImageFromRecord && (
          <div className="existing-image-wrap">
            <p className="detail-label">Ảnh hiện tại đã lưu</p>
            <div className="image-grid">
              <div className="image-card">
                <img src={successImageFromRecord} alt="Ảnh đơn thành công đã lưu" />
              </div>
            </div>
          </div>
        )}
        {successImage && (
          <>
            <p className="detail-label">Ảnh mới đã chọn (sẽ dùng để cập nhật)</p>
            <div className="image-grid">
              <div className="image-card">
                <img src={successImage.preview} alt="Ảnh đơn hàng thành công" />
                <button
                  type="button"
                  className="image-remove-button"
                  onClick={() => removeSelectedImage('success')}
                  disabled={uploadingType === 'success'}
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="upload-actions">
              <button
                type="button"
                onClick={() => void uploadImage('success')}
                disabled={uploadingType === 'success'}
              >
                {uploadingType === 'success' ? 'Đang gửi ảnh...' : 'Gửi ảnh đơn giao thành công'}
              </button>
            </div>
          </>
        )}
      </section>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  )
}
