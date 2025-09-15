import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface GenericSkeletonProps {
  title?: string
  showStats?: boolean
  showTable?: boolean
  showTabs?: boolean
}

export default function GenericSkeleton({ 
  title = "Carregando...",
  showStats = true,
  showTable = true,
  showTabs = false
}: GenericSkeletonProps) {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-80 bg-white/15" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Tabs skeleton */}
        {showTabs && (
          <div className="mb-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-md w-fit">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        )}

        {/* Stats cards skeleton */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-12 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main content skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            {showTable ? (
              <div className="space-y-4">
                {/* Table header */}
                <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                
                {/* Table rows */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 py-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
