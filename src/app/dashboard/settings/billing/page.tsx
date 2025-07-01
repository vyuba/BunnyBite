const BillingPage = () => {
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-[#E3E3E3] px-3 pb-2">
            <h2 className="text-base">Overview</h2>
            <p className="text-sm text-black/70">Info on your billing plan</p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    manage plan
                  </span>
                  <button className="border w-fit border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg">
                    change plan
                  </button>
                </div>
                <div className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5">
                  <label className="flex items-start w-full flex-col gap-1">
                    <span className="text-sm">Billing Information</span>
                    <input
                      type="text"
                      className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50 rounded-md max-w-[400px] py-1.5 px-1.5 w-full text-xs md:text-sm border border-[#E3E3E3]"
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
        </div>
      </div>
    </>
  );
};
export default BillingPage;
