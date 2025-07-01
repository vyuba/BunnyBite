export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex items-center justify-between w-full h-screen">
      <div className="flex flex-col items-center gap-6 justify-center w-full h-full">
        <div className="max-w-[80px] w-full h-full max-h-[80px] relative parent ">
          <div className="shared-style blue" />
          <div className="shared-style red" />
          <div className="shared-style right" />
          <div className="shared-style left" />
          <div className="shared-style bottom" />
          <div className="shared-style top" />
        </div>
        <span>Loading...</span>
      </div>
    </div>
  );
}
