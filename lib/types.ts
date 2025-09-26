export type JobStatus = "queued" | "processing" | "done" | "failed";

export type StudioJob = {
  id: string;
  type: "generate" | "edit";
  status: JobStatus;
  createdAt: string;
  creditsUsed: number;
  trialUsed: boolean;
  input: {
    imageStoragePath: string;
    productName: string;
    description: string;
    style: string;
  };
  result?: {
    imageUrl: string;
    captions: string[];
    hashtags: string[];
  };
};

export type GalleryItem = {
  id: string;
  imageUrl: string;
  title?: string | null;
  tags?: string[] | null;
  createdAt?: string | null;
};
