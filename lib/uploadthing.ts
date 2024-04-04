import { generateReactHelpers, generateUploadButton, generateUploadDropzone, generateUploader, } from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { UploadButton, UploadDropzone, Uploader } = {
  UploadButton: generateUploadButton<OurFileRouter>(),
  UploadDropzone: generateUploadDropzone<OurFileRouter>(),
  Uploader: generateUploader<OurFileRouter>(),
}

const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
  
export {
  UploadButton,
  UploadDropzone,
  Uploader,
  useUploadThing,
  uploadFiles,
}