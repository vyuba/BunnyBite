const AnalyticCard = ({ count, title }: { count: number; title: string }) => {
  return (
    <div className="border w-70 flex flex-col gap-1.5  border-border  transition-[border] text-black/70 capitalize px-3 bg-white text-sm py-2 rounded-lg">
      <h1 className="border-dotted border-b w-fit border-border">{title}</h1>
      <span className="text-medium">{count}</span>
    </div>
  );
};

export default AnalyticCard;
