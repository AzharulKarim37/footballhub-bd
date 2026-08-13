import { useState, useEffect } from "react";
import { fetchNews } from "../services/api";
import "./News.css";

function News() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        fetchNews()
            .then((data) => {
                if (isMounted) {
                    setNewsList(data || []);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Failed fetching news:", err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter list based on search term only
    const filteredNews = newsList.filter((item) => {
        return (
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const handleReadArticle = (article) => {
        if (article.is_rss && article.url) {
            window.open(article.url, "_blank", "noopener,noreferrer");
        } else {
            setSelectedArticle(article);
        }
    };

    const formatDate = (dateString) => {
        try {
            const options = { day: "numeric", month: "short", year: "numeric" };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return dateString;
        }
    };

    return (
        <div className="news-page">
            {/* Hero */}
            <div className="news-hero">
                <h1>Football News Hub</h1>
                <p>Live Bangladesh Football updates and global soccer stories in one place</p>
            </div>

            {/* Search only, centered */}
            <div className="news-tools news-tools-centered">
                <div className="news-search-box">
                    <input
                        type="text"
                        placeholder="Search news, tags, clubs, or players..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* News Grid */}
            {loading ? (
                <div style={{ textAlign: "center", color: "#00ff87", padding: "80px 0", fontSize: "20px", fontWeight: "600" }}>
                    ⚽ Fetching latest football news...
                </div>
            ) : filteredNews.length === 0 ? (
                <div style={{ textAlign: "center", color: "#8fa392", padding: "80px 0", fontSize: "18px" }}>
                    No articles found matching your search.
                </div>
            ) : (
                <div className="news-grid">
                    {filteredNews.map((article, idx) => (
                        <div key={article.id || idx} className="news-card">
                            <div className="news-img-container">
                                {article.image ? (
                                    <img src={article.image} alt={article.title} />
                                ) : (
                                    <div className="news-img-fallback">⚽</div>
                                )}
                                <span className="news-card-badge">{article.category}</span>
                                <span className="news-card-source">{article.source || "Football Hub"}</span>
                            </div>

                            <div className="news-card-content">
                                <div className="news-card-date">
                                    📅 {formatDate(article.created_at)}
                                </div>
                                <h3>{article.title}</h3>
                                <p>{article.summary || article.content}</p>

                                <div className="news-card-footer">
                                    <span className="news-author">By {article.author || "Staff Writer"}</span>
                                    <button
                                        className="news-read-btn"
                                        onClick={() => handleReadArticle(article)}
                                    >
                                        {article.is_rss ? "Read External ↗" : "Read Article →"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Local Articles */}
            {selectedArticle && (
                <div className="news-modal-overlay" onClick={() => setSelectedArticle(null)}>
                    <div className="news-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="news-modal-close"
                            onClick={() => setSelectedArticle(null)}
                        >
                            ×
                        </button>

                        {selectedArticle.image && (
                            <div className="news-modal-img">
                                <img src={selectedArticle.image} alt={selectedArticle.title} />
                            </div>
                        )}

                        <div className="news-modal-body">
                            <div className="news-modal-meta">
                                <span className="news-modal-badge">{selectedArticle.category}</span>
                                <span>📅 {formatDate(selectedArticle.created_at)}</span>
                                <span>✍️ {selectedArticle.author || "Admin"}</span>
                                <span>🏢 {selectedArticle.source || "Football Hub BD"}</span>
                            </div>

                            <h2>{selectedArticle.title}</h2>
                            <div className="news-modal-text">{selectedArticle.content}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default News;