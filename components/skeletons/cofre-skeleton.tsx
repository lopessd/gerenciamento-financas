import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function CofreSkeleton() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-64 bg-white/15" />
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <Skeleton className="h-4 w-12" />
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Skeleton className="h-4 w-20" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-2 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
