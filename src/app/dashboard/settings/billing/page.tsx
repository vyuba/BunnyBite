import { run } from "@/utils";

const BillingPage = () => {
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <h2 className="text-base">Overview</h2>
            <p className="text-sm">Info on your billing plan</p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    manage plan
                  </span>

                  <button className="border w-fit border-border border-b-2  capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg">
                    change plan
                  </button>
                </div>
                <div className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5">
                  <label className="flex items-start w-full flex-col gap-1">
                    <span className="text-sm">Billing Information</span>
                    <input
                      type="text"
                      className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md max-w-[400px] py-1.5 px-1.5 w-full text-sm border border-border"
                      defaultValue={"shop?.shop"}
                    />
                  </label>
                  <button className=" w-fit bg-[#303030] border border-[#4A4A4A] text-white border-b-2  capitalize px-2.5 hover:cursor-pointer  text-sm py-1.5 rounded-lg flex items-center gap-1">
                    <p>edit</p>
                  </button>
                </div>
              </label>
            </div>
          </div>
          <div className=" px-3 mt-3 border-t  border-border">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1 ">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    Payment methods
                  </span>

                  <button
                    onClick={run}
                    className="border w-fit border-border border-b-2  capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg"
                  >
                    add method
                  </button>
                </div>
                <div className="w-full flex flex-col md:flex-row  gap-1.5 pt-1">
                  {/* <span className="text-sm">Cards</span> */}

                  <div className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-[white] focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md max-w-[375px] py-2 px-3 grid gap-1.5 w-full text-xs md:text-sm border border-border">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-2 w-full">
                        <div className="size-8 border border-border bg-secondary-background rounded-sm" />
                        <span className="flex flex-col gap-0.5 items-start">
                          <p className=" text-black/70 dark:text-white/80">
                            ••••2612
                          </p>
                          <p>Expires 03/2028</p>
                        </span>
                      </div>
                      <span className="text-xs md:text-sm bg-background px-1.5 rounded-sm py-0.5 border border-border">
                        Default
                      </span>
                    </div>
                    <button className="text-red-500 w-fit text-xs md:text-sm font-medium capitalize cursor-pointer">
                      delete
                    </button>
                  </div>

                  <div className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-[white] focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md max-w-[375px] py-2 px-3 grid gap-1.5 w-full text-xs md:text-sm border border-border">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-2 w-full">
                        <div className="size-8 border border-border bg-secondary-background rounded-sm" />
                        <span className="flex flex-col gap-0.5 items-start">
                          <p className=" text-black/70 dark:text-white/80">
                            ••••2612
                          </p>
                          <p>Expires 03/2028</p>
                        </span>
                      </div>
                      {/* <span className="text-xs md:text-sm bg-background px-1.5 rounded-sm py-0.5 border border-border">
                        Default
                      </span> */}
                    </div>
                    <div className="w-full flex items-center gap-3">
                      <button className="text-red-500 w-fit text-xs md:text-sm font-medium capitalize cursor-pointer">
                        delete
                      </button>
                      <button className="text-black hover:bg-background px-2 py-1.5 rounded-md dark:text-white w-fit text-xs md:text-sm font-medium capitalize cursor-pointer">
                        set as default
                      </button>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BillingPage;
