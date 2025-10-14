import { useState, useEffect } from "react";
import axios from "axios";

export default function Gallery() {
  const [images, setImages] = useState([]);
  // const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // this method will handle the view button functionality
  const handleView = (index) => {
    setSelectedIndex(index);
  };
  // this method handles the close icon functionality for corousel
  const handleClose = () => {
    setSelectedIndex(null);
  };
  // this  method will show next image in circular manner
  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // this method will show prev image in reverse circular manner
  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };
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

  // one more useEffect to handle keyboard navigation for corousel

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedIndex === null) return;

      switch (event.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>

      <div className="grid grid-cols-3 gap-6">
        {images &&
          images.map((image, index) => (
            <div
              key={image.id}
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
                  onClick={() => handleView(index)}
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

      {/* {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70  flex items-center justify-center"
        >
          <img
            src={`http://localhost:5164/api/Image/getImage/${selectedImage.id}`}
            className="max-w-3xl max-h-[90%] rounded shadow-lg"
          />
        </div>
      )} */}

      {/* Initially we were showing just image while clicking the view buttton but now we are going to implement corousel feature */}

      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* close button */}
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-red-400"
            aria-label="Close"
            onClick={handleClose}
          >
            X
          </button>

          {/* left navigation button */}
          <button
            className="absolute left-6 text-white text-5xl font-bold hover:scale-110 transition"
            aria-label="Previous Image"
            onClick={handlePrev}
          >
            ←
          </button>

          {/* dispaly selected iamge or based or right or left arrow */}

          <img
            src={`http://localhost:5164/api/Image/getImage/${images[selectedIndex].id}`}
            alt={images[selectedIndex].fileName}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />

          {/* right navigation */}

          <button
            className="absolute right-6 text-white text-5xl font-bold hover:scale-110 transition"
            aria-label="Next Image"
            onClick={handleNext}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
