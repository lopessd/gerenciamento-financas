import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = "md", 
  text = "Carregando...", 
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-primary mb-2`} />
      {text && <p className="text-sm text-white">{text}</p>}
    </div>
  )
}
