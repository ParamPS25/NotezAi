import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdCancel } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import Spinner  from "../components/ui/spinner"; // Assuming you have a Spinner component

const UploadForm = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please sign in to generate notes.');
      return;
    }
    
    if (files.length > 0) {
      setLoading(true); // Start loading

      try {
        await onUpload(files); // Simulate async call
      } catch (error) {
        console.error(error);
        setMessage('Error generating notes');
      } finally {
        setLoading(false); // Stop loading after the API call
      }
    }
  };

  const handleClickAdd = () => {
    fileInputRef.current.click();
  };

  const handleRemove = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove)); 
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

      {/* Warning Message */}
      {message && (
        <div className="text-red-500 text-sm text-center -mt-3">{message}</div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-4">
          <Spinner /> {/* Display the spinner */}
          <p className="text-sm text-gray-500 mt-2">Generating notes, please wait...</p>
        </div>
      )}

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={handleClickAdd} disabled={loading}>
          Add Images
        </Button>
        <Button className = "bg-green-300 text-black font-bold hover:bg-green-400 transition duration-200" type="submit" disabled={files.length === 0 || loading}>
          Generate Notes
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;
