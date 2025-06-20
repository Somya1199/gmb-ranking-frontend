import React, { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [business, setBusiness] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rankMessage, setRankMessage] = useState("");
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setError("");
    setLoading(true);
    setResults([]);
    setRankMessage("");

    if (!keyword || !location) {
      setError("⚠️ Please fill in both keyword and location.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({ keyword, location, business }),

      });

      const data = await response.json();
      console.log("API response:", data);

      const resultList = data.results || [];

      setResults(resultList);

      if (business.trim()) {
        const foundIndex = resultList.findIndex((r) =>
          r.name.toLowerCase().includes(business.toLowerCase())
        );

        if (foundIndex !== -1) {
          setRankMessage(`✅ '${business}' is ranked #${foundIndex + 1}`);
        } else {
          setRankMessage(`❌ '${business}' is not found in top ${resultList.length}`);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>📊 GMB Ranker</h2>
        <div style={styles.sidebarItem}>📍 Locations</div>
        <div style={styles.sidebarItem}>🧾 Reports</div>
        <div style={styles.sidebarItem}>⚙️ Settings</div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.pageTitle}>GMB Ranking Tool</h1>

        <div style={styles.form}>
          <input
            placeholder="Business category (e.g., Dentist)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Location (e.g., Mumbai)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Your business name (optional)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleScrape} style={styles.button}>
            {loading ? "⏳ Scraping..." : "Check Ranking"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
          {rankMessage && <p style={styles.rank}><strong>{rankMessage}</strong></p>}
        </div>

        {results.length > 0 && (
          <div style={styles.results}>
            <h2 style={{ marginBottom: "1rem" }}>Top Results</h2>
            <ol style={{ paddingLeft: "1.2rem" }}>
              {results.map((r, i) => (
                <li key={i} style={styles.card}>
                  <p style={styles.cardTitle}>{r.name}</p>
                  <p style={styles.cardDetail}>📍 {r.address}</p>
                  <p style={styles.cardDetail}>⭐ Rating: {r.rating}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 Style Object
const styles = {
  dashboard: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f5f7fa",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
  },
  sidebarItem: {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#34495e",
    transition: "all 0.2s",
  },
  main: {
    flexGrow: 1,
    padding: "2rem",
    color: "#333",
  },
  pageTitle: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "500px",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.8rem",
    fontSize: "1rem",
    backgroundColor: "#2980b9",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#d8000c",
    fontWeight: "bold",
  },
  rank: {
    color: "#006600",
    fontSize: "1.1rem",
  },
  results: {
    marginTop: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.3rem",
  },
  cardDetail: {
    fontSize: "0.95rem",
    color: "#555",
  },
};

export default App;
