import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Upload from "./Pages/Upload";
import Gallery from "./Pages/Gallery";

function App() {
  return (
    <Router>
      <nav className="sticky top-0 z-50 p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/">Upload</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
