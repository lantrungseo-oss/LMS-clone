"use client";

import { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";


// #2 register module
Quill.register("modules/imageUploader", ImageUploader);



interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  imageEnabled?: boolean;
};

const Editor = ({
  onChange,
  value,
  imageEnabled
}: EditorProps) => {

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
            const formData = new FormData();
            formData.append("image", file);
  
            // upload to uploadthing via API in the NextJS
            resolve(URL.createObjectURL(file))
          })
        }
      } : undefined
    };
  }, [imageEnabled])

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