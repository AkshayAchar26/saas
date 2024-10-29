import { Video } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import React, { useCallback, useEffect, useState } from "react";
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import Image from "next/image";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  publicRoute: boolean;
  onTogglePrivacy: ((videoId: string, isPublic: boolean) => void) | null;
  onDownload: (url: string, title: string) => void;
  onDelete: ((publicId: string, videoId: string) => void) | null;
  isDeleting: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDownload,
  publicRoute,
  onTogglePrivacy,
  onDelete,
  isDeleting,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1980,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className={`card bg-base-100 p-4 w-96 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out sm:w-1/2 lg:w-96 md:w-96 relative ${
        isDeleting ? "opacity-50 pointer-events-none" : "hover:scale-105"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      <figure className="aspect-video relative rounded-xl">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-red-500">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="rounded-xl"
              onError={handlePreviewError}
            ></video>
          )
        ) : (
          <Image
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="rounded-xl"
            width={400}
            height={225}
          />
        )}
        <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg rounded-b-lg text-sm flex items-center">
          <Clock size={16} className="mr-1" />
          {formatDuration(video.duration)}
        </div>
      </figure>
      <div className="card-body  text-center p-2 gap-2">
        <h2 className="card-title text-lg font-semibold justify-start p-0">
          {video.title}
        </h2>
        {video.description && (
          <p className="flex justify-start">{video.description}</p>
        )}
        <p className="text-sm text-base-content flex justify-start">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm items-center">
          <div className="flex items-center justify-center">
            <FileUp size={18} className="mr-2 text-primary" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <FileDown size={18} className="mr-2 text-secondary" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-semibold">
            Compression:{" "}
            <span className="text-accent">{compressionPercentage}%</span>
          </div>
          {!publicRoute && (
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => onDelete!(video.publicId, video.id)}
              >
                delete
              </button>
              <button
                className={`btn ${
                  video.isPublic ? "btn-secondary" : "btn-accent"
                } btn-sm btn-outline`}
                onClick={() => onTogglePrivacy!(video.id, !video.isPublic)}
              >
                {video.isPublic ? "Private" : "Public"}
              </button>
            </div>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
