export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-border rounded-md ${className}`} />
}
