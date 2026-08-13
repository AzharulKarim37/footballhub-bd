import db from "../config/db.js";

// Simple in-memory cache for combined news (local + RSS)
let newsCache = {
    data: null,
    timestamp: 0,
};
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// ======================================================
// REGEX RSS PARSER UTILITY
// ======================================================
const parseRSS = (xmlText, defaultCategory, sourceName) => {
    const items = [];
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];

        const getTag = (tag) => {
            const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`, "i");
            const m = itemContent.match(regex);
            if (!m) return "";
            return (m[1] || m[2] || "").trim();
        };

        const title = getTag("title");
        const link = getTag("link");
        const description = getTag("description");
        const pubDate = getTag("pubDate");

        let image = "";

        // 1. Check <enclosure url="..." />
        const enclosureMatch = itemContent.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
        if (enclosureMatch) {
            image = enclosureMatch[1];
        }

        // 2. Check <media:content url="..." />
        if (!image) {
            const mediaMatch = itemContent.match(/<media:content[^>]+url=["']([^"']+)["']/i);
            if (mediaMatch) {
                image = mediaMatch[1];
            }
        }

        // 3. Check <media:thumbnail url="..." />
        if (!image) {
            const thumbMatch = itemContent.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
            if (thumbMatch) {
                image = thumbMatch[1];
            }
        }

        // 4. Look for <img> src inside description html
        if (!image && description) {
            const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) {
                image = imgMatch[1];
            }
        }

        // Clean HTML tags from summary description
        const cleanSummary = description
            .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        if (title) {
            items.push({
                id: `rss-${sourceName}-${link || title}`,
                title: title,
                summary: cleanSummary.substring(0, 200) + (cleanSummary.length > 200 ? "..." : ""),
                content: cleanSummary,
                image: image || null,
                category: defaultCategory,
                author: sourceName,
                source: sourceName,
                url: link || null,
                created_at: pubDate ? new Date(pubDate) : new Date(),
                is_rss: true,
            });
        }
    }
    return items;
};

// ======================================================
// GET NEWS (MERGED LOCAL DB + RSS FEEDS, WITH CACHE)
// ======================================================
export const getNews = async (req, res) => {
    try {
        const now = Date.now();

        // Serve from cache if still fresh
        if (newsCache.data && now - newsCache.timestamp < CACHE_DURATION_MS) {
            return res.json({
                success: true,
                count: newsCache.data.length,
                news: newsCache.data,
                cached: true,
            });
        }

        // 1. Fetch Admin written news from database
        const [dbArticles] = await db.query("SELECT * FROM articles ORDER BY created_at DESC");

        const localNews = dbArticles.map((art) => ({
            ...art,
            is_rss: false,
        }));

        // 2. Fetch RSS Feeds asynchronously in parallel
        const feeds = [
            { url: "https://en.prothom-alo.com/feed/", category: "BD Football", source: "Prothom Alo" },
            { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", category: "World Football", source: "BBC Sport" },
        ];

        const feedPromises = feeds.map(async (feed) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(feed.url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const xmlText = await response.text();
                return parseRSS(xmlText, feed.category, feed.source);
            } catch (err) {
                console.warn(`⚠️ Failed fetching RSS from ${feed.source}:`, err.message);
                return [];
            }
        });

        const rssResults = await Promise.allSettled(feedPromises);
        let allRssNews = [];

        rssResults.forEach((result) => {
            if (result.status === "fulfilled") {
                allRssNews = allRssNews.concat(result.value);
            }
        });

        // 3. Merge and Sort by date descending
        const combinedNews = [...localNews, ...allRssNews].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB - dateA;
        });

        // Update cache
        newsCache = {
            data: combinedNews,
            timestamp: now,
        };

        res.json({
            success: true,
            count: combinedNews.length,
            news: combinedNews,
            cached: false,
        });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while retrieving news feed.",
        });
    }
};

// ======================================================
// GET LOCAL ARTICLES ONLY (For admin panel list)
// ======================================================
export const getLocalArticles = async (req, res) => {
    try {
        const [dbArticles] = await db.query("SELECT * FROM articles ORDER BY created_at DESC");
        res.json({
            success: true,
            articles: dbArticles,
        });
    } catch (error) {
        console.error("Error fetching local articles:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve local articles.",
        });
    }
};

// ======================================================
// CREATE CUSTOM ARTICLE
// ======================================================
export const createArticle = async (req, res) => {
    try {
        const { title, content, summary, image, category, author, source } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required.",
            });
        }

        const calculatedSummary = summary || content.substring(0, 150) + (content.length > 150 ? "..." : "");
        const finalAuthor = author || req.user.name || "Admin";
        const finalSource = source || "Football Hub BD";
        const finalCategory = category || "BD Football";

        const [result] = await db.query(
            `INSERT INTO articles (title, content, summary, image, category, author, source) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, content, calculatedSummary, image || null, finalCategory, finalAuthor, finalSource]
        );

        newsCache.timestamp = 0; // Invalidate cache so new article shows immediately

        res.status(201).json({
            success: true,
            message: "Article created successfully.",
            articleId: result.insertId,
        });
    } catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create article.",
        });
    }
};

// ======================================================
// UPDATE CUSTOM ARTICLE
// ======================================================
export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, summary, image, category, author, source } = req.body;

        const [existing] = await db.query("SELECT id FROM articles WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Article not found.",
            });
        }

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required.",
            });
        }

        const calculatedSummary = summary || content.substring(0, 150) + (content.length > 150 ? "..." : "");
        const finalAuthor = author || "Admin";
        const finalSource = source || "Football Hub BD";
        const finalCategory = category || "BD Football";

        await db.query(
            `UPDATE articles 
       SET title = ?, content = ?, summary = ?, image = ?, category = ?, author = ?, source = ? 
       WHERE id = ?`,
            [title, content, calculatedSummary, image || null, finalCategory, finalAuthor, finalSource, id]
        );

        newsCache.timestamp = 0; // Invalidate cache so edit shows immediately

        res.json({
            success: true,
            message: "Article updated successfully.",
        });
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update article.",
        });
    }
};

// ======================================================
// DELETE CUSTOM ARTICLE
// ======================================================
export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query("SELECT id FROM articles WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Article not found.",
            });
        }

        await db.query("DELETE FROM articles WHERE id = ?", [id]);

        newsCache.timestamp = 0; // Invalidate cache so deletion reflects immediately

        res.json({
            success: true,
            message: "Article deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete article.",
        });
    }
};