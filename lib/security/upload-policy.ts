export const allowedUploadMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp"
];

export const maxUploadSizeBytes = 5 * 1024 * 1024;

export function isAllowedUpload(mimeType: string, size: number) {
  return allowedUploadMimeTypes.includes(mimeType) && size <= maxUploadSizeBytes;
}
