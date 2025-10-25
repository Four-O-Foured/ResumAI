import { useState, useEffect, type FormEvent } from "react";
import Nav from "~/components/Nav";
import Uploader from "~/components/Uploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/utils/pdfToImage";
import { nanoid } from "nanoid";
import { prepareInstructions } from "~/constants";
import { useNavigate } from "react-router";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const [isProcessing, setisProcessing] = useState(false);
  const [statusText, setstatusText] = useState(" ");
  const [file, setfile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  // Ensure component is mounted on client before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (e: File | null) => {
    setfile(e);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File | null;
  }) => {
    setisProcessing(true);
    setstatusText("Uploading your file...");

    try {
      const uploadResult = await fs.upload([file!]);

      // CRITICAL FIX: fs.upload returns an ARRAY, get the first element
      const uploadedFile = Array.isArray(uploadResult)
        ? uploadResult[0]
        : uploadResult;

      if (!uploadedFile || !uploadedFile.path) {
        console.error(
          "Upload failed. Full file object:",
          JSON.stringify(uploadedFile, null, 2)
        );
        setstatusText("Error uploading file - no path returned");
        setisProcessing(false);
        return;
      }

      setstatusText("Converting file to image...");

      const imageresult = await convertPdfToImage(file!);

      if (!imageresult || !imageresult.file) {
        setstatusText("Error converting file to image");
        setisProcessing(false);
        return;
      }

      setstatusText("Uploading converted image...");

      const uploadImgResult = await fs.upload([imageresult.file]);

      // CRITICAL FIX: Same for image upload - get first element
      const uploadImg = Array.isArray(uploadImgResult)
        ? uploadImgResult[0]
        : uploadImgResult;

      if (!uploadImg || !uploadImg.path) {
        console.error(
          "Image upload failed. Full object:",
          JSON.stringify(uploadImg, null, 2)
        );
        setstatusText("Error uploading image - no path returned");
        setisProcessing(false);
        return;
      }

      setstatusText("Preparing data...");

      const data = {
        id: nanoid(),
        resumePath: uploadedFile.path,
        imagePath: uploadImg.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      console.log("Data prepared:", data);

      await kv.set(`resume:${data.id}`, JSON.stringify(data));

      setstatusText("Analyzing resume...");

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobDescription, jobTitle })
      );


      if (!feedback || !feedback.message || !feedback.message.content) {
        console.error("Invalid feedback response:", feedback);
        setstatusText("Error analyzing resume - invalid response");
        setisProcessing(false);
        return;
      }

      const feebackTxt =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0]?.text;

      console.log("Feedback text:", feebackTxt);

      if (!feebackTxt) {
        console.error("Empty feedback text");
        setstatusText("Error: Empty feedback response");
        setisProcessing(false);
        return;
      }

      try {
        data.feedback = JSON.parse(feebackTxt);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Failed to parse:", feebackTxt);
        setstatusText("Error parsing feedback - invalid JSON format");
        setisProcessing(false);
        return;
      }

      await kv.set(`resume:${data.id}`, JSON.stringify(data));

      setstatusText("Analysis completed! Redirecting...");

      console.log("Final data:", data);

      setisProcessing(false);

      navigate(`/review/${data.id}`);
    } catch (error) {
      console.error("Error during analysis:", error);
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "no stack"
      );
      setstatusText(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setisProcessing(false);
    }
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = e.currentTarget;
    if (!formData) return;

    const companyName = formData.companyName.value as string;
    const jobTitle = formData.jobTitle.value as string;
    const jobDescription = formData.jobDescription.value as string;

    // CRITICAL FIX: Validate file before submission
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    console.log("Submitting with:", {
      companyName,
      jobTitle,
      jobDescription,
      fileName: file,
    });

    handleAnalyze({ companyName, jobDescription, jobTitle, file });
  };

  // Don't render until mounted on client
  if (!isMounted) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Nav />
        <section className="main-section">
          <div className="page-heading">
            <h1>Upload Your Resume</h1>
            <h2>Review your resume for an ATS score and improvement tips.</h2>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Nav />
      <section className="main-section">
        <div className="page-heading">
          <h1>Upload Your Resume</h1>
          {isProcessing ? (
            <>
              <h1>{statusText}</h1>
              <img
                src="/images/resume-scan.gif"
                alt="scanning your resume"
                className=""
              />
            </>
          ) : (
            <h2>Review your resume for an ATS score and improvement tips.</h2>
          )}

          {!isProcessing && (
            <form
              className="flex flex-col gap-4"
              id="upload-form"
              onSubmit={submitHandler}
            >
              <div className="form-div">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  placeholder="Company Name"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="jobTitle">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  placeholder="Job Title"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="jobDescription">Job Description</label>
                <textarea
                  rows={5}
                  name="jobDescription"
                  id="jobDescription"
                  placeholder="Job Description"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="Uploader">Upload Resume</label>
                <Uploader onFileSelect={handleFileChange} />
              </div>

              <button className="primary-button" type="submit">
                <p>Analyze Resume</p>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default upload;
