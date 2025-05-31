export interface Image {
  id: string;
  url: string;
  description: string;
  uploadedBy: string;
  uploaderName?: string;
  uploadedAt: string;
  detectedPeopleCount: number;
  boundingBoxes: { x: number; y: number; width: number; height: number }[];
  previewBoxes?: { x: number; y: number; width: number; height: number }[];
}
