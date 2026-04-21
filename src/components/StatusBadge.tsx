import type { LinkStatus } from '../types'

interface StatusBadgeProps {
  status: LinkStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusLabelMap: Record<LinkStatus, string> = {
    WAIT_LINK: 'Đang xử lý',
    DONE: 'Hoàn tất link',
    WAIT_ORDER: 'Đã đặt hàng',
    DONE_ORDER: 'Đã hoàn thành',
  }

  const doneState = status === 'DONE' || status === 'DONE_ORDER'
  const label = statusLabelMap[status]

  return (
    <span className={`status-badge ${doneState ? 'done' : 'wait'}`}>
      {label}
    </span>
  )
}
