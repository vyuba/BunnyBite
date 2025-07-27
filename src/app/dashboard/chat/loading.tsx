import Skeleton from "@/components/Skeleton";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex flex-col md:z-0 w-full h-fit gap-2 pb-15">
      <div className="w-full relative md:z-0 overflow-hidden h-[calc(100dvh-135px)] flex gap-2">
        {/* Message container  */}
        <div
          className={`"z-10 -translate-x-[100%] md:translate-x-0"
         absolute left-0 md:z-0 transition-transform w-full md:static md:w-[25%] md:min-w-[250px] h-full flex flex-col pt-2 border border-border overflow-hidden rounded-lg bg-secondary-background gap-2 text-black/70 dark:text-white/70`}
        >
          {/* Search Input Skeleton */}
          <div className="border mx-2 px-2 rounded-sm border-border">
            <Skeleton styling="w-full h-8" />
          </div>

          {/* Chat List Skeleton */}
          <div className="bg-primary-background mx-1 mb-1 p-2 h-full rounded-lg border-t border-border flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-sm"
              >
                {/* Profile Icon */}
                <Skeleton styling="size-10 rounded-full" />

                {/* Chat Name & Last Message */}
                <div className="flex flex-col gap-1.5 w-[70%]">
                  <Skeleton styling="w-2/3 h-3" />
                  <Skeleton styling="w-1/2 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
