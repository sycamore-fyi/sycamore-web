import { Skeleton } from "@/components/ui/skeleton";


export function LoadingDashboard() {
  return (
    <div className="flex h-full w-full">
      <div className="w-64 border-r-2 border-gray-100">
        <div className="h-12 box-border py-2 px-4 rounded-xl mb-4">
          <Skeleton className="h-full" />
        </div>
        <div className="space-y-3 px-4">
          <Skeleton className="h-6 rounded-xl" />
          <Skeleton className="h-6 rounded-xl" />
          <Skeleton className="h-6 rounded-xl" />
          <Skeleton className="h-6 rounded-xl" />
        </div>

      </div>
      <div className="flex-grow flex-col flex">
        <div className="h-12 border-b-2 border-gray-100 flex items-center px-4 gap-2">
          <Skeleton className="rounded-full h-6 w-20" />
          <div className="flex-grow"></div>
          <Skeleton className="rounded-full h-9 w-9" />
        </div>
        <div className="flex-grow px-8 py-12">
          <div className="space-y-8">
            <div className="flex gap-3">
              <Skeleton className="rounded-full h-4 w-10" />
              <Skeleton className="rounded-full h-4 w-10" />
              <Skeleton className="rounded-full h-4 w-10" />
            </div>
            <Skeleton className="rounded-full h-12 w-[300px]" />
            <div className="grid grid-cols-3 gap-8">
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
