import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2500)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}
