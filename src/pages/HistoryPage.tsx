import { useCallback, useEffect, useState } from 'react'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { StatusBadge } from '../components/StatusBadge'
import { POLL_INTERVAL_MS } from '../config'
import { useUid } from '../hooks/useUid'
import { fetchHistory } from '../services/api'
import { useAppDispatch } from '../store/hooks'
import { setSelectedRecord } from '../store/historySlice'
import type { HistoryRecord } from '../types'

const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'mock-1',
    link: 'https://s.shopee.vn/W2rMIetr3',
    affiliate: 'https://s.shopee.vn/W2rMIetr3',
    status: 'DONE',
    time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    productPrice: 150000,
    commissionRate: 8,
    estimatedCommissionVnd: 120000,
  },
  {
    id: 'mock-2',
    link: 'https://s.shopee.vn/W2rMIetr3',
    affiliate: '',
    status: 'WAIT_LINK',
    time: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    productPrice: 89000,
    commissionRate: 5,
    estimatedCommissionVnd: 44500,
  },
  {
    id: 'mock-3',
    link: 'https://s.shopee.vn/W2rMIetr3',
    affiliate: 'https://s.shopee.vn/W2rMIetr3',
    status: 'DONE_ORDER',
    time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    productPrice: 250000,
    commissionRate: 6,
    estimatedCommissionVnd: 150000,
  },
]

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

function getTodayDateString() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().split('T')[0]
}

export function HistoryPage() {
  const { uid, hasUid } = useUid()
  const dispatch = useAppDispatch()
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString())
  const useMockData = import.meta.env.VITE_USE_MOCK_HISTORY === 'true'

  const loadHistory = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true)
    }

    if (useMockData) {
      setRecords(MOCK_HISTORY)
      setError('')
      if (showLoading) {
        setLoading(false)
      }
      return
    }

    if (!hasUid) {
      if (showLoading) {
        setLoading(false)
      }
      return
    }

    try {
      const result = await fetchHistory(uid, selectedDate)
      setRecords(result)
      setError('')
    } catch (requestError) {
      setRecords(MOCK_HISTORY)
      setError(
        requestError instanceof Error
          ? `${requestError.message} (đang hiển thị dữ liệu mẫu)`
          : 'Không thể tải lịch sử. Đang hiển thị dữ liệu mẫu.',
      )
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [hasUid, selectedDate, uid, useMockData])

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadHistory(true)
    }, 0)

    const poller = window.setInterval(() => {
      void loadHistory(false)
    }, POLL_INTERVAL_MS)

    return () => {
      window.clearTimeout(initialLoadTimer)
      window.clearInterval(poller)
    }
  }, [loadHistory])

  return (
    <section className="card">
      <div className="history-header">
      <h1>Lịch Sử Xử Lý</h1>
      <p className="helper-text">
        Lịch Sử Ngày{' '}
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => {
            setSelectedDate(event.target.value)
          }}
        />
      </p>
      </div>
      <p className="helper-text">Tự động làm mới sau 1 phút</p>
      
      <p className="info-banner">
        Mẹo: bấm <strong>Xem chi tiết</strong> để tải ảnh minh chứng và theo dõi hoa hồng đơn hàng.
      </p>

      {!hasUid && (
        <p className="error-text">Bắt buộc có uid. Hãy thêm `?uid=your-uid` vào URL.</p>
      )}
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Link Đặt Hàng</th>
                <th>Trạng Thái</th>
                <th>Thời Gian</th>
                <th>Hoa hồng ước tính (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    Không có dữ liệu cho uid này.
                  </td>
                </tr>
              )}

              {records.map((record, index) => {
                const affiliateAvailable = Boolean(record.affiliate)
                const productPrice = record.productPrice ?? 0
                const commissionRate = record.commissionRate ?? 0
                const estimatedCommission = (productPrice * commissionRate) / 100
                const hasCommissionRate =
                  record.commissionRate != null && record.commissionRate > 0
                const canShowCommission =
                  hasCommissionRate &&
                  (record.status === 'WAIT_ORDER' ||
                    record.status === 'DONE_ORDER' ||
                    record.status === 'DONE')
                const detailHref = `/detail${window.location.search}`
                return (
                  <tr key={record.id ?? `${record.link}-${index}`}>
                    <td>
                      {affiliateAvailable ? (
                        <div className="affiliate-cell">
                          <a href={record.affiliate} target="_blank" rel="noreferrer">
                            { record.affiliate || '-' }
                          </a>
                          <a
                            href={detailHref}
                            onClick={() => {
                              dispatch(setSelectedRecord(record))
                            }}
                          >
                            Xem chi tiết
                          </a>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    <td>{formatTime(record.time)}</td>
                    <td>{canShowCommission ? formatCurrencyVnd(estimatedCommission) : 'Đang ước tính hoa hồng'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="status-note">
        <h2>Giải thích trạng thái</h2>
        <ul>
          <li>
            <strong>Đang xử lý</strong>: Đang trong quá trình xử lý link.
          </li>
          <li>
            <strong>Hoàn tất link</strong>: Link đã được chuyển đổi thành công.
          </li>
          <li>
            <strong>Đã đặt hàng</strong>: Bạn đã đặt hàng thành công.
          </li>
          <li>
            <strong>Đã hoàn thành</strong>: Đơn hàng thành công, hoa hồng sẽ được thanh toán.
          </li>
        </ul>
        <p>Khi trạng thái chuyển sang <strong>Hoàn tất link</strong> bạn có thể click vào link phía trên để đặt hàng. Để quá trình xử lý minh bạch sau khi đặt hàng hãy gửi chi tiết đơn hàng trong <strong>Xem chi tiết</strong> hoa hồng của bạn sẽ được ghi nhận sau đó.</p>
      </section>
    </section>
  )
}
