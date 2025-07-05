import { CircleDashed } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <CircleDashed className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;