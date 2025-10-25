import Nav from "~/components/Nav";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resumai" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setresumes] = useState<Resume[]>([]);
  const [loadingResume, setloadingResume] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      setloadingResume(true);
      const resume = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resume?.map((r) => JSON.parse(r.value) as Resume);
      console.log(parsedResumes);

      setresumes(parsedResumes || []);
      setloadingResume(false);
    };

    loadResumes();
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Nav />

      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResume && resumes?.length === 0 ? (
            <h2>No resume found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submission and check AI-powered feedback.</h2>
          )}
        </div>

        {loadingResume && <div className="flex items-center justify-center flex-col">
          <img src="/images/resume-scan-2.gif" alt="Loading Resumes..." className="w-[400px]" />
        </div> }

        {!loadingResume && resumes.length > 0 && (
          <div className="resumes-section pt-18">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResume && resumes.length === 0 && (
          <div className="flex items-center justify-center flex-col">
            <Link to="/upload" className="primary-button w-fit">Upload Your first resume</Link>
          </div>
        )}
      </section>
    </main>
  );
}
