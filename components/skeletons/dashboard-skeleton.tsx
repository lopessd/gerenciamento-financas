import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Welcome section skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-48 bg-white/15" />
        </div>

        {/* Modules grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick stats skeleton */}
        <div className="mt-12">
          <Skeleton className="h-6 w-32 mb-4 bg-white/20" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-8 mx-auto" />
                    <Skeleton className="h-3 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}