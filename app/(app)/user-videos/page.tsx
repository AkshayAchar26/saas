"use client";

import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [deletingVideos, setDeletingVideos] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");

      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleTogglePrivacy = useCallback(
    async (videoId: string, isPublic: boolean) => {
      try {
        const response = await axios.post("/api/toggle-privacy", {
          videoId,
          isPublic,
        });

        if (response.status === 200) {
          setVideos((prevVideos) =>
            prevVideos.map((video) =>
              video.id === videoId ? { ...video, isPublic } : video
            )
          );
        }
      } catch (error) {
        console.error("Error toggling privacy:", error);
      }
    },
    []
  );

  const handleDeleteVideo = useCallback(
    async (publicId: string, videoId: string) => {
      setDeletingVideos((prevState) => ({ ...prevState, [videoId]: true }));
      try {
        const response = await axios.delete("/api/delete-video", {
          data: {
            videoId,
            public_id: publicId,
          },
        });

        if (response.status === 200) {
          setVideos((prevVideos) =>
            prevVideos.filter((video) => video.id !== videoId)
          );
          console.log("Video deleted successfully:", response.data);
        } else {
          console.error("Error deleting video:", response.data.error);
        }

        revalidatePath("/user-video");
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setDeletingVideos((prevState) => ({ ...prevState, [videoId]: false }));
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
        role="alert"
      >
        <strong className="font-bold">Error:</strong> {error}
        <button onClick={fetchVideos} className="ml-2 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">My Videos</h1>
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center text-lg text-gray-500 mb-4">
            No videos available
          </div>
          <Link
            href="/video-upload"
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          >
            Add Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
              publicRoute={false}
              onTogglePrivacy={handleTogglePrivacy}
              onDelete={handleDeleteVideo}
              isDeleting={!!deletingVideos[video.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
