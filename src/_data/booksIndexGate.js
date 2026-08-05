import { readFileSync } from "node:fs";

// One-item list when at least one book is public, empty otherwise.
//
// The /books/ index paginates over this, so the index page itself doesn't exist
// until there's something to list. An empty "Books" page is worse than no Books
// page — it advertises that nothing is finished.
const books = JSON.parse(
  readFileSync(new URL("./books.json", import.meta.url), "utf8")
);

export default () => (books.some((book) => !book.draft) ? [true] : []);
