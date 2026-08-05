import { DateTime } from "luxon";
import rssPlugin from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);

  // Static assets are copied verbatim; the CSS is hand-written, not compiled.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addWatchTarget("src/assets/css/");

  // ---- Filters -------------------------------------------------------------

  eleventyConfig.addFilter("readableDate", (value) =>
    DateTime.fromJSDate(new Date(value), { zone: "utc" }).toFormat("LLLL d, yyyy")
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    DateTime.fromJSDate(new Date(value), { zone: "utc" }).toISO()
  );

  eleventyConfig.addFilter("htmlDate", (value) =>
    DateTime.fromJSDate(new Date(value), { zone: "utc" }).toFormat("yyyy-LL-dd")
  );

  // Absolute URL, needed by sitemap, feeds, and every piece of structured data.
  eleventyConfig.addFilter("absolute", (path, base) => {
    try {
      return new URL(path, base).toString();
    } catch {
      return path;
    }
  });

  // Strip tags so page copy can be reused as a meta description or in llms.txt.
  eleventyConfig.addFilter("plain", (content) =>
    String(content || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

  eleventyConfig.addFilter("truncate", (str, n = 160) => {
    const s = String(str || "").trim();
    if (s.length <= n) return s;
    return s.slice(0, s.lastIndexOf(" ", n)) + "…";
  });

  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value, null, 2));

  // Decimal year → "Jun 2012". The career chart stores positions as numbers so
  // it can plot them; this turns them back into something readable.
  eleventyConfig.addFilter("yearLabel", (value) => {
    const year = Math.floor(value);
    const monthIndex = Math.round((value - year) * 12);
    if (monthIndex === 0) return String(year);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[Math.min(monthIndex, 11)]} ${year}`;
  });

  // Split prose stored in JSON (which can't hold real markup) into paragraphs.
  eleventyConfig.addFilter("paragraphs", (text) =>
    String(text || "")
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
  );

  // ---- Collections ---------------------------------------------------------

  eleventyConfig.addCollection("posts", (collection) =>
    collection
      .getFilteredByGlob("src/blog/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  // Posts in the Data series. They stay in `posts` too, so they appear on the
  // blog index and in both feeds — /data/ is a curated view, not a silo.
  eleventyConfig.addCollection("dataPosts", (collection) =>
    collection
      .getFilteredByGlob("src/data-series/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  // Every distinct tag across published posts — drives the tag archive pages.
  eleventyConfig.addCollection("postTags", (collection) => {
    const tags = new Set();
    collection
      .getFilteredByGlob("src/blog/*.md")
      .filter((item) => !item.data.draft)
      .forEach((item) => (item.data.tags || []).forEach((t) => tags.add(t)));
    return [...tags].sort();
  });

  eleventyConfig.addFilter("filterByTag", (posts, tag) =>
    (posts || []).filter((post) => (post.data.tags || []).includes(tag))
  );

  eleventyConfig.addFilter("slugify", (str) =>
    String(str)
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
