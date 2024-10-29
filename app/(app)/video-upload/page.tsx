"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/ErrorAlert";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const router = useRouter();
  //max file size of 60 mb

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      //TODO: add notification
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());
    formData.append("isPublic", isPublic ? "true" : "false");

    try {
      const response = await axios.post("/api/video-upload", formData);

      if (response.status !== 200) {
        throw new Error("Unable to upload video");
      }

      router.push("/user-videos");
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Unable to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Make Public</span>
          </label>
          <input
            type="checkbox"
            className="toggle toggle-lg"
            value={isPublic ? "true" : "false"}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
          {error && <ErrorAlert errorMessage={error} />}
        </button>
        {isUploading && (
          <div className="mt-4">
            <progress className="progress progress-primary w-full"></progress>
          </div>
        )}
      </form>
    </div>
  );
}

export default VideoUpload;