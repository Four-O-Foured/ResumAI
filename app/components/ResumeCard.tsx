import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [ImageUrl, setImageUrl] = useState(" ");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      const image = URL.createObjectURL(blob);
      setImageUrl(image);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/review/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h1 className="!text-black font-black break-words !text-2xl">
              {companyName}
            </h1>
          )}
          {jobTitle && (
            <h2 className="!text-lg break-words text-gray-500">{jobTitle}</h2>
          )}

          {!companyName && !jobTitle && (
            <h1 className="!text-black font-black break-words !text-2xl">
              Resume
            </h1>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {ImageUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={ImageUrl}
              alt="Resume Image"
              className="w-full h-[350px] max-sm:h-[250px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
