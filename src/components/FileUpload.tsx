import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import { ExistingFiles } from "../types";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({
    opracowanie_1: null,
    opracowanie_2: null,
    data_in: null,
  });
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>(
    {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>("ALGO");
  const [existingFiles, setExistingFiles] = useState<ExistingFiles>({
    opracowanie_1: false,
    opracowanie_2: false,
    data_in: false,
  });

  useEffect(() => {
    const checkExistingFiles = async () => {
      try {
        const response = await api.get("/api/files");
        setExistingFiles(response.data);
      } catch (error) {
        console.error("Error checking existing files:", error);
      }
    };
    checkExistingFiles();
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileKey: string
  ) => {
    const file = event.target.files?.[0] || null;
    if (fileKey === "data_in" && file && file.name !== "data.in") {
      const newFile = new File([file], "data.in", { type: file.type });
      setSelectedFiles((prev) => ({ ...prev, [fileKey]: newFile }));
    } else {
      setSelectedFiles((prev) => ({ ...prev, [fileKey]: file }));
    }
    setUploadStatus((prev) => ({ ...prev, [fileKey]: "" }));
  };

  const uploadFile = async (file: File, fileKey: string) => {
    const formData = new FormData();
    formData.append("file", file);

    if (fileKey === "data_in") {
      formData.append("path", selectedPath);
    }

    try {
      await api.post("/api/upload", formData);
      return true;
    } catch (error) {
      console.error(`Error uploading ${fileKey}:`, error);
      return false;
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const newStatus: { [key: string]: string } = {};

    if (selectedFiles.data_in) {
      const success = await uploadFile(selectedFiles.data_in, "data_in");
      newStatus.data_in = success ? "Uploaded successfully" : "Upload failed";

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    for (const [key, file] of Object.entries(selectedFiles)) {
      if (file && key !== "data_in") {
        const success = await uploadFile(file, key);
        newStatus[key] = success ? "Uploaded successfully" : "Upload failed";
      }
    }

    setUploadStatus(newStatus);
    setIsUploading(false);

    const uploadedFiles = Object.entries(selectedFiles).filter(
      ([_, file]) => file !== null
    );
    const allSuccessful = uploadedFiles.every(
      ([key, _]) => newStatus[key] === "Uploaded successfully"
    );

    if (allSuccessful && uploadedFiles.length > 0) {
      const response = await api.get("/api/files");
      setExistingFiles(response.data);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dodawanie plików</h2>
      <div style={styles.uploadContainer}>
        {!existingFiles.data_in && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Wybór ścieżki</h3>
            <div style={styles.fileInput}>
              <label style={styles.label}>
                Ścieżka:
                <select
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  style={styles.select}
                >
                  <option value="ALGO">ALGO</option>
                  <option value="ALAP">ALAP</option>
                  <option value="WO">WO</option>
                </select>
              </label>
              <label style={styles.label}>
                data.in:
                <input
                  type="file"
                  accept=".in,.txt"
                  onChange={(e) => handleFileChange(e, "data_in")}
                  style={styles.input}
                />
                <span style={{ paddingBottom: 8 }}>
                  Plik(.in) powinien składać się z wierszy w formacie:
                </span>
                <span style={{ paddingBottom: 8 }}>
                  nr_pytania nazwa_przedmiotu numer_semestru ścieżka pytanie
                </span>
                <span> przykłady:</span>
                <span>
                  2 Algorytmy i struktury danych 4 --- Kim jest Marek Marucha?
                </span>
                <span>1 Teoria Kompilacji 2 ALGO Kim jest Automatow?</span>
              </label>
              {uploadStatus.data_in && (
                <div
                  style={{
                    ...styles.status,
                    color: uploadStatus.data_in.includes("  ")
                      ? "#4CAF50"
                      : "#f44336",
                  }}
                >
                  {uploadStatus.data_in}
                </div>
              )}
            </div>
          </div>
        )}

        {(!existingFiles.opracowanie_1 || !existingFiles.opracowanie_2) && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Opracowania(PDF)</h3>
            {["opracowanie_1", "opracowanie_2"].map((fileKey) => {
              if (!existingFiles[fileKey as keyof ExistingFiles]) {
                return (
                  <div key={fileKey} style={styles.fileInput}>
                    <label style={styles.label}>
                      {fileKey.replace("_", " ")}:
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, fileKey)}
                        style={styles.input}
                      />
                    </label>
                    {uploadStatus[fileKey] && (
                      <div
                        style={{
                          ...styles.status,
                          color: uploadStatus[fileKey].includes("success")
                            ? "#4CAF50"
                            : "#f44336",
                        }}
                      >
                        {uploadStatus[fileKey]}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {Object.values(existingFiles).every((exists) => exists) && (
          <div style={styles.allFilesUploaded}>
            Wszystkie pliki zostały dodane.
            <Navigate to="/app" replace />
          </div>
        )}
      </div>
      {!Object.values(existingFiles).every((exists) => exists) && (
        <button
          onClick={handleUpload}
          disabled={
            isUploading || !Object.values(selectedFiles).some((file) => file)
          }
          style={{
            ...styles.button,
            opacity:
              isUploading || !Object.values(selectedFiles).some((file) => file)
                ? 0.7
                : 1,
          }}
        >
          {isUploading ? "Dodaję..." : "Dodaj pliki"}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center" as const,
    color: "#333",
    marginBottom: "2rem",
  },
  section: {
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
  },
  sectionTitle: {
    color: "#444",
    marginBottom: "1rem",
    fontSize: "1.2rem",
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },
  fileInput: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    color: "#666",
    fontSize: "1rem",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  select: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.9rem",
    backgroundColor: "white",
  },
  button: {
    marginTop: "2rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
  status: {
    fontSize: "0.9rem",
    marginTop: "0.25rem",
  },
  allFilesUploaded: {
    textAlign: "center" as const,
    padding: "2rem",
    color: "#4CAF50",
    fontSize: "1.2rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
  },
};

export default FileUpload;
