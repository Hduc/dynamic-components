import React from "react";

interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-4",
  lg: "w-12 h-12 border-4",
};

const Loading: React.FC<LoadingProps> = ({ text = "Loading...", size = "md", fullScreen = false }) => {
  const spinner = (
    <div className={`${sizeMap[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
        {spinner}
        {text && <p className="mt-2 text-gray-700">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {spinner}
      {text && <span className="text-gray-700">{text}</span>}
    </div>
  );
};

export default Loading;
