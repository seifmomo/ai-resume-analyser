"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { ResumeData } from "@/types";

interface FileUploadProps {
  onUpload: (resume: ResumeData) => void;
  multiple?: boolean;
  onMultipleUpload?: (resumes: ResumeData[]) => void;
}

export default function FileUpload({ onUpload, multiple = false, onMultipleUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const messages = fileRejections.flatMap((r) => r.errors.map((e) => e.message));
        const tooLarge = fileRejections.some((r) => r.errors.some((e) => e.code === "file-too-large"));
        setError(tooLarge ? "Some files exceed the 4MB limit" : messages[0]);
      }

      if (acceptedFiles.length === 0) return;

      setUploading(true);

      try {
        if (multiple && acceptedFiles.length >= 2) {
          const results = await Promise.all(
            acceptedFiles.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              const res = await fetch("/api/upload", { method: "POST", body: formData });
              if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
              return res.json();
            })
          );
          onMultipleUpload?.(results);
        } else {
          const file = acceptedFiles[0];
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
          }
          const resume: ResumeData = await res.json();
          onUpload(resume);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUpload, multiple, onMultipleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple,
    maxFiles: multiple ? 5 : 1,
    maxSize: 4 * 1024 * 1024,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-gray-700 hover:border-gray-500 bg-gray-900"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-400">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-emerald-400">Drop your PDF here</p>
        ) : (
          <div>
            <p className="text-gray-300 mb-2">Drag & drop your PDF resume here, or click to browse</p>
            <p className="text-sm text-gray-500">PDF files up to 4MB {multiple ? "(up to 5 files)" : ""}</p>
          </div>
        )}
      </div>
      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
