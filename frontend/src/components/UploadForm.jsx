import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdCancel } from "react-icons/md";


const UploadForm = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleClickAdd = () => {
    fileInputRef.current.click();
  };

  const handleRemove = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));     // don't care about particular files that needs to be removes so, placing _ in the first parameter 
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full lg:max-w-lg max-w-md mx-auto flex flex-col gap-6 mt-4 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Hidden file input */}
      <Input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Show selected file thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, indx) => (

            <div key={indx} className="relative border rounded p-2">
              
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover rounded"
              />

              <button
                type="button"
                onClick={() => handleRemove(indx)}
                className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow"
              >
                <MdCancel size={20} />
              </button>
              <p className="text-xs mt-1 truncate text-center">{file.name}</p>
            </div>
          ))}
        </div>
       )}

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={handleClickAdd}>
          Add Images
        </Button>
        <Button type="submit" disabled={files.length === 0}>
          Generate Notes
        </Button>
      </div>
    </form>
    // User clicks "Add Images" → calls handleClickAdd
    // handleClickAdd() programmatically triggers the hidden file input's .click() method
    // That opens the native file picker
    // Once files are chosen, the onChange handler captures them
  );
};

export default UploadForm;


// const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setFiles((prev) => [...prev, ...newFiles]);
//   };


// const fileList = e.target.files;
// console.log(fileList); // FileList { 0: File, 1: File, ... }

// const fileArray = Array.from(fileList);
// console.log(fileArray); // [File, File, ...]

