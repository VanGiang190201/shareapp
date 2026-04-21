const NAV_ITEMS = [
  { label: 'Gửi Link', path: '/submit' },
  { label: 'Lịch Sử', path: '/history' },
  { label: 'Hướng Dẫn', path: '/instruction' },
]

export function Navbar() {
  const currentPath = window.location.pathname.toLowerCase()

  return (
    <header className="navbar">
      <div className="brand-wrap">
        <span className="brand-mark" aria-hidden="true">
          S
        </span>
        <div className="brand-copy">
          <div className="brand">Công Cụ Link Affiliate</div>
          <p className="brand-subtitle">Theo dõi link Shopee nhanh và rõ ràng</p>
        </div>
      </div>
      <nav className="nav-links" aria-label="Điều hướng chính">
        {NAV_ITEMS.map((item) => {
          const active = currentPath === item.path
          return (
            <a
              key={item.path}
              className={`nav-link ${active ? 'active' : ''}`}
              href={item.path + window.location.search}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
