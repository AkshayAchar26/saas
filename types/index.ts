export interface Video {
  id: string;
  userId: string;
  title: string;
  description: string;
  isPublic: boolean;
  publicId: string;
  originalSize: number;
  compressedSize: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}
