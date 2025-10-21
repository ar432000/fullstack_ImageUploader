import { useState, useRef } from "react";
import axios from "axios";
export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) alert("please select an image to upload");
    const formData = new FormData();
    formData.append("File", file);
    try {
      await axios.post("http://localhost:5164/api/Image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("image uploaded successfully");
      setFile(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      alert(`Error uploading image or file - ${error.message}`);
    }
  };

  return (
    <div className="flex flex-cols items-center gap-4 p-6">
      <h2 className="text-2xl font-bold">Upload Image</h2>
      {/* for now i am allowing just to pick only images , later scope will be extended */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="border-2 border-black rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      {preview && (
        <div className="mt-4 border-2 border-solid rounded-[15px]">
          <img
            src={preview}
            alt="Preview"
            className="w-64 h-64 object-cover rounded-[15px] shadow"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="align-middle px-4 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
}
