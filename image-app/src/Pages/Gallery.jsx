import { useState, useEffect } from "react";
import axios from "axios";

export default function Gallery() {
  const [images, setImages] = useState([]);
  // const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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
    let interval = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(interval);
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

  // disable body scroll when modal (selectedIndex) is open
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (selectedIndex !== null) {
      // store current overflow to restore later if needed
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);
  if (isLoading)
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="bg-white/95 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg px-6 py-4 flex items-center gap-4 max-w-md mx-4">
          <svg
            className="w-5 h-5 animate-spin text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <div>
            <div className="text-lg font-medium">Please wait.</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              We are working to fetch images data.
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="p-6 pb-28">
      {/* extra bottom padding to avoid footer overlap */}
      <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>

      {images && images.length > 0 ? (
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
      ) : (
        <div className=" bg-amber-200 p-2 m-auto w-150 h-auto text-center text-gray-500 text-xl mt-10 rounded-[10px]">
          Oops! Looks like images did not load. This could be due to network
          issue or backend server is down or connection interrupted.
        </div>
      )}

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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
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
      {/* fixed footer */}
      <footer className="fixed left-0 right-0 bottom-0 bg-white/90 dark:bg-gray-900/100 border-t border-gray-200 dark:border-gray-400 py-3 px-6 flex items-center justify-between z-50">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} My Image App
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Made with ❤️
        </div>
      </footer>
    </div>
  );
}
