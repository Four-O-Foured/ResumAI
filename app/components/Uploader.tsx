import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils/formatSize";

interface UploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const Uploader = ({ onFileSelect }: UploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      const file = acceptedFiles[0] || null;

      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
              <img src="/images/pdf.png" alt="pdf" className="size-10" />
              <div>
                <p className="text-sm font-medium truncate text-gray-700 max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>

              <button className="cursor-pointer p-2 " onClick={() => {onFileSelect?.(null)}}>
                <img src="/icons/cross.svg" alt="remove file" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <img src="/icons/info.svg" alt="" className="size-17" />
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to Upload </span>or Drag
                and drop your resume here.{" "}
                <small>(.PDF only, Max size: {formatSize(maxFileSize)})</small>
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Uploader;
