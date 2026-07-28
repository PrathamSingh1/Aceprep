import { cn } from "@/lib/utils"

export const Heading = ({ children, className, as = 'h2' }: {
  children: React.ReactNode,
  className?: string
  as?: 'h1' | 'h2'
}) => {
  const Tag = as
  return (
    <Tag className={cn("tracking-tight font-manrope", className)}>
      {children}
    </Tag>
  )
}
