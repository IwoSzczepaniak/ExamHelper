import { BrowserRouter, Route, Routes } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import QuestionsPage from "./QuestionsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/app" element={<QuestionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
