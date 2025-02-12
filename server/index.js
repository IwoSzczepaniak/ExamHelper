import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3001;
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateQuestions = (filePath, eduPath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    const questions = {};

    console.log(`Generating questions for ${eduPath}...`);

    lines.forEach(line => {
      const parts = line.trim().split(' ');
      if (parts.length < 2) return;

      const number = parseInt(parts[0]);
      const rest = parts.slice(1).join(' ');

      if (isNaN(number)) return;

      let category, semester, subject, question;

      if (rest.includes('---')) {
        category = "PYTANIA GENERALNE";
        const [beforeDash, afterDash] = rest.split('---').map(s => s.trim());
        const beforeParts = beforeDash.split(' ');
        semester = beforeParts[beforeParts.length - 1];
        subject = beforeParts.slice(0, -1).join(' ');
        question = afterDash;
      } else if (rest.includes(eduPath)) {
        category = eduPath;
        const [beforePath, afterPath] = rest.split(eduPath).map(s => s.trim());
        const beforeParts = beforePath.split(' ');
        semester = beforeParts[beforeParts.length - 1];
        subject = beforeParts.slice(0, -1).join(' ');
        question = afterPath;
      } else {
        return;
      }

      questions[number] = {
        subject,
        semester,
        category,
        question
      };
    });

    console.log(`✅ Generated ${Object.keys(questions).length} questions for ${eduPath}`);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

app.use(cors({
  origin: PUBLIC_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

// Only serve build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../build")));
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log('Processing file:', file.originalname); // Debug log
    if (file.originalname === "data.in") {
      cb(null, "data.in");
    } else if (file.originalname.match(/\.(pdf)$/)) {
      const files = fs.readdirSync(uploadsDir);
      if (!files.includes("opracowanie_1.pdf")) {
        cb(null, "opracowanie_1.pdf");
      } else if (!files.includes("opracowanie_2.pdf")) {
        cb(null, "opracowanie_2.pdf");
      } else {
        cb(
          new Error("Both opracowanie_1.pdf and opracowanie_2.pdf already exist"),
          false
        );
      }
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Filtering file:', file.originalname, 'mimetype:', file.mimetype); // Debug log
    if (file.mimetype === "application/pdf" || file.originalname === "data.in") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files and data.in are allowed!"), false);
    }
  },
});

app.use((err, req, res, next) => {
  console.error('Error occurred:', err); // Debug log
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "File upload error", details: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log('Upload request received:', req.file); // Debug log
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (req.file.filename === "data.in") {
    try {
      const selectedPath = req.body.path;
      
      if (!["ALGO", "ALAP", "WO"].includes(selectedPath)) {
        throw new Error("Invalid path selected");
      }

      const questions = generateQuestions(
        path.join(uploadsDir, "data.in"),
        selectedPath
      );
      
      fs.writeFileSync(
        path.join(__dirname, "../src/questions.json"),
        JSON.stringify(questions, null, 2),
        'utf8'
      );

      res.json({
        message: "File uploaded and questions generated successfully",
        filename: req.file.filename,
      });
    } catch (error) {
      console.error('Error in question generation:', error);
      res.status(500).json({
        error: "Failed to generate questions",
        details: error.message
      });
    }
  } else {
    res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });
  }
});

app.get("/opracowanie_:num.pdf", (req, res) => {
  const num = req.params.num;
  const filePath = path.join(uploadsDir, `opracowanie_${num}.pdf`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "PDF file not found" });
  }
});

app.get("/questions.json", (req, res) => {
  const questionsPath = path.join(__dirname, "../src/questions.json");
  if (fs.existsSync(questionsPath)) {
    res.sendFile(questionsPath);
  } else {
    res.status(404).json({ error: "Questions file not found" });
  }
});

app.get("/data.in", (req, res) => {
  const dataPath = path.join(__dirname, "../uploads/data.in");
  if (fs.existsSync(dataPath)) {
    res.sendFile(dataPath);
  } else { 
    res.status(404).json({ error: "Data file not found" });
  }
});

app.get("/api/files", (req, res) => {
  const files = fs.readdirSync(uploadsDir);
  res.json({
    opracowanie_1: files.includes("opracowanie_1.pdf"),
    opracowanie_2: files.includes("opracowanie_2.pdf"),
    data_in: files.includes("data.in")
  });
});

if (process.env.NODE_ENV === 'production') {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
