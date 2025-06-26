const AnouncementBanner = () => {
  return (
    <div className="w-full h-14 bg-[#EBEBEB]  flex flex-row-reverse md:flex-row justify-between items-center">
      <div className="flex items-center gap-1 px-4">
        <p className="capitalize text-black/70 text-sm font-medium hidden md:block">
          just 9 days on your advanced plan
        </p>
        <button className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-3 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg">
          manage plan
        </button>
      </div>
      <div className="flex items-center gap-1 px-4">
        <p className="capitalize text-sm ">continue configuring your profile</p>
      </div>
    </div>
  );
};

export default AnouncementBanner;
