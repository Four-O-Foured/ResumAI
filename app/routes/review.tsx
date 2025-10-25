import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Ats from "~/components/Ats";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

const review = () => {
  const { id } = useParams();
  const { auth, isLoading, kv, fs } = usePuterStore();
  const [ImageUrl, setImageUrl] = useState("");
  const [ResumeUrl, setResumeUrl] = useState("");
  const [Feedback, setFeedback] = useState<Feedback | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/review/${id}`);
  }, [isLoading, auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      if (!data) return;

      console.log(data);
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);
      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);

      console.log(ImageUrl, ResumeUrl, Feedback);

      // TODO: Load resume data into state
    };

    loadResume();
  }, [id]);
  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button w-fit">
          <img
            src="/icons/back.svg"
            className="w-2.5 h-2.5 "
            alt="Back to homepage"
          />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="w-full flex flex-row max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg') h-[100vh] top-0 items-center justify-center bg-cover]">
          {ImageUrl && ResumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-2xl:h-fit w-fit">
              <a href={ResumeUrl} target="_blank" rel="noopener noreferror">
                <img
                  src={ImageUrl}
                  alt="Resume Image"
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="!text-gray-800 text-4xl font-bold">Resume Review</h2>
          {Feedback ? (
            <div className="flex flex-col gap-8  animate-in fade-in duration-1000">
              <Summary feedback={Feedback} />
              <Ats
                score={Feedback.ATS.score || 0}
                suggestions={Feedback.ATS.tips || []}
              />
              <Details feedback={Feedback} />
            </div>
          ) : (
            <img
              src="/images/resume-scan-2.gif"
              alt="loading"
              className="w-full"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default review;
