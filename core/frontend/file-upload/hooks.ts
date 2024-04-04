import { useUploadThing } from "@/lib/uploadthing";
import { EFileUploadEndpoint } from "../constants"

export type TUseFileUploadProps = {
  endpoint: EFileUploadEndpoint;
}

export type TUseFileUploadResult = {
  uploadFiles: (files: File[]) => Promise<{ url: string}[] | undefined>;
}

export const useFileUpload = ({
  endpoint
}: TUseFileUploadProps) : TUseFileUploadResult => {
  const { startUpload } = useUploadThing(
    endpoint as any, {
      onClientUploadComplete: (res) => {
        console.log("uploaded successfully!", res);
      },
      onUploadError: () => {
        console.log("error occurred while uploading");
      },
      onUploadBegin: () => {
        console.log("upload has begun");
      },
      onUploadProgress: (p) => {
        console.log('Upload progress yeah', p);
      },
    }
  )

  return {
    uploadFiles: startUpload,
    
  }
}