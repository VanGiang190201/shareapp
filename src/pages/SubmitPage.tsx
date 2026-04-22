import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Toast } from '../components/Toast'
import { useUid } from '../hooks/useUid'
import { submitShopeeLink } from '../services/api'

function isValidShopeeLink(value: string) {
  return value.toLowerCase().includes('shopee')
}

export function SubmitPage() {
  const { uid, hasUid } = useUid()
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null,
  )

  const canSubmit = useMemo(() => hasUid && !loading, [hasUid, loading])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const trimmedLink = link.trim()

    if (!hasUid) {
      setError('Thiếu uid. Hãy mở ứng dụng với URL dạng ?uid=abc123.')
      return
    }

    if (!trimmedLink || !isValidShopeeLink(trimmedLink)) {
      setError('Vui lòng nhập link sản phẩm Shopee hợp lệ.')
      return
    }

    try {
      setLoading(true)
      await submitShopeeLink(uid, trimmedLink)
      setLink('')
      setToast({ message: 'Gửi link thành công.', type: 'success' })
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Không thể gửi link.',
      )
      setToast({ message: 'Gửi link thất bại.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h1>Gửi Link Shopee</h1>
      <p className="helper-text">Người dùng hiện tại: {uid || 'Chưa nhận diện'}</p>
      <p className="info-banner">
        Dán đúng link sản phẩm để hệ thống xử lý nhanh hơn và hạn chế lỗi xác minh. Sau đó truy cập <strong>Lịch Sử</strong> để chờ nhận link affiliate từ hệ thống.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label htmlFor="product-link">Nhập link sản phẩm Shopee</label>
        <input
          id="product-link"
          type="url"
          placeholder="https://shopee..."
          value={link}
          onChange={(event) => setLink(event.target.value)}
          disabled={!canSubmit}
        />
        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>

      {!hasUid && (
        <p className="error-text">
          Truy cập website với đường dẫn được cung cấp bởi nhân viên hỗ trợ trong Zalo. Điều này
          giúp hệ thống ghi nhận đúng hoa hồng của bạn khi đặt hàng.
        </p>
      )}
      {error && <p className="error-text">{error}</p>}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  )
}
