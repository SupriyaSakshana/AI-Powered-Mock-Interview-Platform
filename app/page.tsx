"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // 🔥 IMPORTANT FIX
  const API_URL = "http://127.0.0.1:5000";

  // 🔹 TEXT SUMMARIZATION
  const handleTextSummarize = async () => {
    if (!text.trim()) {
      alert("Please enter text");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      console.log("Calling TEXT API...");

      const res = await fetch(`${API_URL}/summarize/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      setSummary(data.summary);

    } catch (error: any) {
      console.error("TEXT ERROR:", error.message);
      setSummary("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 PDF SUMMARIZATION
  const handlePdfSummarize = async () => {
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Calling PDF API...");

      const res = await fetch(`${API_URL}/summarize/pdf`, {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      setSummary(data.summary);

    } catch (error: any) {
      console.error("PDF ERROR:", error.message);
      setSummary("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 AI Summarizer</h1>

      <div style={styles.grid}>

        {/* TEXT */}
        <div style={styles.card}>
          <h2>📝 Text Summarization</h2>

          <textarea
            style={styles.textarea}
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            style={styles.button}
            onClick={handleTextSummarize}
            disabled={loading}
          >
            {loading ? "⏳ Processing..." : "Summarize Text"}
          </button>
        </div>

        {/* PDF */}
        <div style={styles.card}>
          <h2>📄 PDF Summarization</h2>

          <input
            type="file"
            accept="application/pdf"
            style={styles.fileInput}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            style={styles.button}
            onClick={handlePdfSummarize}
            disabled={loading}
          >
            {loading ? "⏳ Processing..." : "Summarize PDF"}
          </button>
        </div>
      </div>

      {/* OUTPUT */}
      <div style={styles.outputCard}>
        <h2>📌 Summary</h2>

        <textarea
          style={styles.output}
          value={summary}
          readOnly
          placeholder="Summary will appear here..."
        />
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles: any = {
  container: {
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Segoe UI",
  },
  title: {
    fontSize: "34px",
    marginBottom: "30px",
    textAlign: "center",
  },
  grid: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: "300px",
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #374151",
  },
  fileInput: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  button: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  outputCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },
  output: {
    width: "100%",
    height: "160px",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #374151",
  },
};