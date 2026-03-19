interface Props {
  children: React.ReactNode
  color?: string
  className?: string
}

export default function Badge({ children, color = '#2dd4bf', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${className}`}
      style={{ backgroundColor: color + '20', color }}
    >
      {children}
    </span>
  )
}
