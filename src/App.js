import React, { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [business, setBusiness] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rankMessage, setRankMessage] = useState("");
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard"); // NEW
const [reportHistory, setReportHistory] = useState([
  {
    keyword: "Dentist",
    location: "Mumbai",
    business: "Smile Dental Care",
    timestamp: "2025-06-20 09:45",
    rank: 3,
  },
  {
    keyword: "Cafe",
    location: "Bangalore",
    business: "Bean House",
    timestamp: "2025-06-19 18:22",
    rank: null,
  },
]);

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
        headers: { "Content-Type": "application/json" },
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
            <h2
        style={{ ...styles.logo, cursor: "pointer" }}
        onClick={() => setActivePage("dashboard")}
      >
        📊 GMB Ranker
      </h2>

        <div
          style={{
            ...styles.sidebarItem,
            backgroundColor: activePage === "locations" ? "#1abc9c" : "#34495e",
          }}
          onClick={() => setActivePage("locations")}
        >
          📍 Locations
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            backgroundColor: activePage === "reports" ? "#1abc9c" : "#34495e",
          }}
          onClick={() => setActivePage("reports")}
        >
          🧾 Reports
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            backgroundColor: activePage === "about" ? "#1abc9c" : "#34495e",
          }}
          onClick={() => setActivePage("about")}
        >
          ℹ️ About
        </div>

      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {activePage === "dashboard" && (
          <>
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
          </>
        )}

        {activePage === "locations" && (
        <div>
          <h2 style={{ marginBottom: "1rem" }}>📍 Available Locations in India</h2>
          <div style={styles.locationGrid}>
            {[
              "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad",
              "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow",
              "Surat", "Kanpur", "Nagpur", "Indore", "Thane",
              "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ludhiana"
            ].map((city) => (
              <div key={city} style={styles.locationCard}>
                📍 {city}
              </div>
            ))}
          </div>
        </div>
      )}
{activePage === "reports" && (
  <div>
    <h1 style={styles.pageTitle}>🧾 Search Reports</h1>
    <div style={styles.reportGrid}>
      {reportHistory.map((report, i) => (
        <div
          key={i}
          style={styles.reportCard}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, styles.reportCardHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.reportCard)
          }
        >
          <h3 style={styles.reportTitle}>
            {report.keyword} in {report.location}
          </h3>
          <p style={styles.reportText}>
            Business: <strong>{report.business || "N/A"}</strong>
          </p>
          <p style={styles.reportText}>
            Rank: {report.rank ? `#${report.rank}` : "Not Found"}
          </p>
          <p style={styles.reportTimestamp}>📅 {report.timestamp}</p>
          <button
            style={styles.reportButton}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.reportButtonHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, styles.reportButton)
            }
            onClick={() => {
              setKeyword(report.keyword);
              setLocation(report.location);
              setBusiness(report.business);
              handleScrape();
              setActivePage("dashboard");
            }}
          >
            🔁 Re-run Search
          </button>
        </div>
      ))}
    </div>
  </div>
)}



  {activePage === "about" && (
  <div style={styles.aboutContainer}>
    <h1 style={styles.pageTitle}>ℹ️ About GMB Ranker</h1>
    <p style={styles.aboutText}>
      <strong>GMB Ranker</strong> is a simple tool that helps you find where your business stands
      in Google Maps search results. Just enter your business type, location, and (optionally) your
      business name — and we’ll show you the top listings and your rank!
    </p>
    <p style={styles.aboutText}>
      This is especially useful for local businesses, marketers, and SEO professionals who want to
      track their visibility or keep an eye on competitors.
    </p>
    <p style={styles.aboutText}>
      ✅ Easy to use<br />
      🔍 Real-time search results<br />
      📍 Works for any city and business type
    </p>
    <p style={styles.aboutText}>
      GMB Ranker is powered by <strong>React</strong> (frontend), <strong>FastAPI</strong> (backend),
      and uses <strong>SerpAPI</strong> + <strong>OpenCage</strong> to fetch and analyze data from Google Maps.
    </p>
    <p style={styles.aboutText}>
      💡 Built by <strong>Somya Gupta & Rishabh Madhwal</strong> — feel free to connect or contribute:
    </p>
    <p style={styles.aboutText}>
      🌐 <a href="https://github.com/Somya1199/gmb-ranking-frontend" target="_blank" rel="noreferrer">Somya - GitHub</a> |  
      🌐 <a href="https://github.com/RishiMadhwal/gmb_ranker" target="_blank" rel="noreferrer">Rishabh - GitHub</a> |  
      
    </p>
  </div>
)}

      </div>
    </div>
  );
}

// 🎨 Styles unchanged
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
  minWidth: "600px", // ⬅️ Add this line
},
sidebar: {
  width: "220px",
  flexShrink: 0, // 👈 prevents shrinking when content is small
  backgroundColor: "#2c3e50",
  color: "#ecf0f1",
  padding: "2rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
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


  reportGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1.5rem",
  marginTop: "1rem",
},

reportCard: {
  backgroundColor: "#ffffff",
  padding: "1rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "transform 0.2s, box-shadow 0.2s",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderLeft: "6px solid #1abc9c",
},

reportCardHover: {
  transform: "scale(1.02)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
},

reportTitle: {
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginBottom: "0.3rem",
  color: "#2c3e50",
},

reportText: {
  fontSize: "0.95rem",
  color: "#444",
  margin: "0.2rem 0",
},

reportTimestamp: {
  fontSize: "0.8rem",
  color: "#888",
  marginTop: "0.5rem",
},

reportButton: {
  marginTop: "0.8rem",
  padding: "0.6rem",
  backgroundColor: "#2980b9",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "background-color 0.3s",
},

reportButtonHover: {
  backgroundColor: "#1f6391",
},

  cardDetail: {
    fontSize: "0.95rem",
    color: "#555",
  },
  locationGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1rem",
  marginTop: "1rem",
},

locationCard: {
  backgroundColor: "#ecf0f1",
  padding: "1rem",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
},
sidebarItem: {
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor: "#34495e",
  transition: "all 0.2s ease-in-out",
  userSelect: "none",
  fontSize: "1rem",
}





};

export default App;
