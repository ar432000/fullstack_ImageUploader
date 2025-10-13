import { useState, useEffect } from "react";
import axios from "axios";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5164/api/Image/getImages"
      );
      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (Id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`http://localhost:5164/api/Image/delete/${Id}`);
      setImages(images.filter((imgList) => imgList.id !== Id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>

      <div className="grid grid-cols-3 gap-6">
        {images &&
          images.map((image) => (
            <div
              key={image.Id}
              className="p-4 border rounded shadow flex flex-col items-center"
            >
              <img
                src={`http://localhost:5164/api/Image/getImage/${image.id}`}
                alt={image.fileName}
                className="w-48 h-40 object-cover rounded mb-2"
              />

              <p className="text-sm">{image.FileName}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSelectedImage(image)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(image.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70  flex items-center justify-center"
        >
          <img
            src={`http://localhost:5164/api/Image/getImage/${selectedImage.id}`}
            className="max-w-3xl max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
