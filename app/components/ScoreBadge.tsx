import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = "bg-red-100 text-red-700 border-red-300";
  let label = "Needs Work";

  if (score >= 70) {
    badgeColor = "bg-green-100 text-green-700 border-green-300";
    label = "Strong";
  } else if (score > 49) {
    badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-300";
    label = "Good Start";
  }

  return (
    <div
      className={`flex items-center justify-center px-3 py-1 border  rounded-full w-25 ${badgeColor}`}
    >
      <p className="!text-xs font-medium ">{label}</p>
    </div>
  );
};

export default ScoreBadge;
