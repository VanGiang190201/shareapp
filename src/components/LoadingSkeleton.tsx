export function LoadingSkeleton() {
  return (
    <div className="skeleton-wrap" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="skeleton-row" />
      ))}
    </div>
  )
}
