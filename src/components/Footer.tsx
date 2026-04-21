import { APP_CONFIG } from '../config'

export function Footer() {
  const query = typeof window !== 'undefined' ? window.location.search : ''
  const instructionHref = `/instruction${query}`
  const zaloHref = APP_CONFIG.zaloUrl || undefined

  return (
    <footer className="site-footer">
      <p className="site-footer-text">
        Cảm ơn bạn đã hợp tác cùng chúng tôi. Hãy đọc kỹ{' '}
        <a href={instructionHref}>hướng dẫn sử dụng</a> trước khi thực hiện chuyển đổi. Mọi thắc mắc
        liên hệ tới{' '}
        {zaloHref ? (
          <a href={zaloHref} target="_blank" rel="noreferrer">
            Zalo
          </a>
        ) : (
          <span className="site-footer-muted">Zalo</span>
        )}{' '}
      </p>
    </footer>
  )
}
