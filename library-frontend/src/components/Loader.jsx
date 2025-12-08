export default function Loader() {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <div className="relative h-12 w-12">
            <div className="absolute h-12 w-12 animate-ping rounded-full bg-indigo-200 opacity-75"></div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 shadow-lg">
                <svg className="h-6 w-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
            </div>
        </div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading Library Data...</p>
      </div>
    );
  }