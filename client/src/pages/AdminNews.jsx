import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    fetchLocalArticles,
    createNews,
    updateNews,
    deleteNews,
} from "../services/api";
import "./AdminNews.css";
import "./AdminDashboard.css";

function AdminNews() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    // Auth Guard
    useEffect(() => {
        if (!token || !user || user.role !== "admin") {
            navigate("/login");
        }
    }, [token, user, navigate]);

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "BD Football",
        image: "",
        summary: "",
        content: "",
        source: "Football Hub BD",
        author: user?.name || "Admin",
    });

    const [error, setError] = useState("");

    const loadArticles = async () => {
        setLoading(true);
        try {
            const data = await fetchLocalArticles(token);
            setArticles(data || []);
        } catch (err) {
            console.error("Error loading local articles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadArticles();
        }
    }, [token]);

    const handleOpenModal = (article = null) => {
        setError("");
        if (article) {
            setEditingArticle(article);
            setFormData({
                title: article.title || "",
                category: article.category || "BD Football",
                image: article.image || "",
                summary: article.summary || "",
                content: article.content || "",
                source: article.source || "Football Hub BD",
                author: article.author || user?.name || "Admin",
            });
        } else {
            setEditingArticle(null);
            setFormData({
                title: "",
                category: "BD Football",
                image: "",
                summary: "",
                content: "",
                source: "Football Hub BD",
                author: user?.name || "Admin",
            });
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.title || !formData.content) {
            setError("Title and content are required.");
            return;
        }

        try {
            if (editingArticle) {
                await updateNews(editingArticle.id, formData, token);
            } else {
                await createNews(formData, token);
            }
            setShowModal(false);
            loadArticles();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save article.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
            try {
                await deleteNews(id, token);
                loadArticles();
            } catch (err) {
                alert(err.response?.data?.message || "Failed to delete article.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="admin-page">
            {/* Sidebar navigation */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <img src="/src/assets/logos/logo.png" alt="Football Hub BD" />
                    <h2>Football Hub BD</h2>
                    <span>ADMIN PANEL</span>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-link">
                        📊 Dashboard
                    </Link>
                    <Link to="/admin/matches" className="admin-nav-link">
                        ⚽ Matches
                    </Link>
                    <Link to="/admin/leagues" className="admin-nav-link">
                        🏆 Leagues
                    </Link>
                    <Link to="/admin/players" className="admin-nav-link">
                        🏃 Players
                    </Link>
                    <Link to="/admin/quizzes" className="admin-nav-link">
                        📝 Quiz Management
                    </Link>
                    <Link to="/admin/news" className="admin-nav-link active">
                        📰 Manage News
                    </Link>
                    <Link to="/" className="admin-nav-link">
                        🌐 View Website
                    </Link>
                </nav>

                <button className="admin-logout" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            <main className="admin-main">
                {/* Topbar */}
                <div className="admin-topbar">
                    <div>
                        <h1>News Management</h1>
                        <p>Write and manage local news articles for Football Hub BD</p>
                    </div>

                    <div className="admin-user">
                        <div className="admin-avatar">
                            {(user?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>{user?.name || "Admin"}</strong>
                            <span>Administrator</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="admin-section">
                    <div className="admin-header-row">
                        <div>
                            <h2>Custom Database Articles</h2>
                            <p>These articles will show up at the top of the news section</p>
                        </div>
                        <button className="admin-add-btn" onClick={() => handleOpenModal()}>
                            ➕ Write Article
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ padding: "40px 0", color: "#123d2a", textAlign: "center", fontWeight: "600" }}>
                            Loading articles...
                        </div>
                    ) : articles.length === 0 ? (
                        <div style={{ padding: "40px 0", color: "#666", textAlign: "center", background: "white", borderRadius: "10px" }}>
                            No custom articles created yet. Click "Write Article" to publish your first post.
                        </div>
                    ) : (
                        <table className="news-list-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Summary</th>
                                    <th>Category</th>
                                    <th>Published Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((art) => (
                                    <tr key={art.id}>
                                        <td>
                                            <div className="news-title-cell" title={art.title}>
                                                {art.title}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="news-summary-cell" title={art.summary || art.content}>
                                                {art.summary || art.content}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-role" style={{ background: "#e8f5e9", color: "#1b5e20", textTransform: "uppercase", fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "4px" }}>
                                                {art.category}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "13px", color: "#666" }}>
                                            {new Date(art.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td>
                                            <div className="news-actions">
                                                <button
                                                    className="news-edit-btn"
                                                    onClick={() => handleOpenModal(art)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="news-delete-btn"
                                                    onClick={() => handleDelete(art.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* Editor Modal */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>{editingArticle ? "Edit News Article" : "Write News Article"}</h3>
                            <button
                                className="admin-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="admin-modal-body">
                                {error && (
                                    <div style={{ color: "red", background: "#ffebee", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "14px" }}>
                                        {error}
                                    </div>
                                )}

                                <div className="admin-form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter article title"
                                        required
                                    />
                                </div>

                                <div style={{ display: "flex", gap: "15px" }}>
                                    <div className="admin-form-group" style={{ flex: 1 }}>
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="BD Football">BD Football</option>
                                            <option value="World Football">World Football</option>
                                        </select>
                                    </div>

                                    <div className="admin-form-group" style={{ flex: 1 }}>
                                        <label>Image Link</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="Paste an image URL (e.g. https://example.com/photo.jpg)"
                                        />

                                        <div
                                            style={{
                                                marginTop: "10px",
                                                width: "100%",
                                                height: "140px",
                                                borderRadius: "8px",
                                                border: "1px dashed #ccc",
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#f7f7f7",
                                            }}
                                        >
                                            {formData.image ? (
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                        e.target.nextSibling.style.display = "flex";
                                                    }}
                                                />
                                            ) : null}

                                            <div
                                                style={{
                                                    display: formData.image ? "none" : "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    color: "#999",
                                                    fontSize: "13px",
                                                    gap: "4px",
                                                }}
                                            >
                                                <span style={{ fontSize: "28px" }}>🖼️</span>
                                                <span>{formData.image ? "Image failed to load" : "No image yet"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "15px" }}>
                                    <div className="admin-form-group" style={{ flex: 1 }}>
                                        <label>Source</label>
                                        <input
                                            type="text"
                                            name="source"
                                            value={formData.source}
                                            onChange={handleInputChange}
                                            placeholder="Source name"
                                        />
                                    </div>

                                    <div className="admin-form-group" style={{ flex: 1 }}>
                                        <label>Author</label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="Author name"
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label>Summary / Snippet</label>
                                    <textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        placeholder="Brief summary of the article (optional, auto-generated if left blank)"
                                        rows={2}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Full Content *</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Write the full body content here..."
                                        rows={6}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="admin-save-btn">
                                    Publish Article
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminNews;