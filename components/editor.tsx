"use client";

import { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";

import "react-quill/dist/quill.snow.css";
import { EFileUploadEndpoint } from "@/core/frontend/constants";
import { useFileUpload } from "@/core/frontend/file-upload/hooks";

// #1 import quill-image-uploader

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);



interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  imageEnabled?: boolean;
  imageEndpoint?: EFileUploadEndpoint;
};

const Editor = ({
  onChange,
  value,
  imageEnabled,
  imageEndpoint
}: EditorProps) => {

  const { uploadFiles } = useFileUpload({
    endpoint: imageEndpoint ?? EFileUploadEndpoint.courseImage,
  })

  const modules = useMemo(() => {
    return {
      // #3 Add "image" to the toolbar
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],
        ['link', 'formula', ...(imageEnabled ? ['image'] : [])],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        ['clean']                                         // remove formatting button
      ],      
      // # 4 Add module and upload function
      
      imageUploader: imageEnabled ? {
        upload: (file: File) => {
          return new Promise((resolve, reject) => {
            uploadFiles([file]).then((result) => {
              if(result && result.length) {
                resolve(result[0].url);
                return;
              }
              reject(new Error('Fail to upload image'))
            })
          });
        }
      } : undefined
    };
  }, [imageEnabled, uploadFiles])

  const formats = useMemo(() => {
    return [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "imageBlot" // #5 Optinal if using custom formats
    ];
  }, [])

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        modules={modules}
        formats={formats}
        onChange={onChange}
      />
    </div>
  );
};

export default Editor