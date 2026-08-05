import { readFileSync } from "node:fs";

// Books that are ready to be public.
//
// The book and chapter templates paginate over THIS list, not over books.json.
// A draft book therefore generates zero pages rather than a hidden one — no
// permalink gymnastics, and nothing can leak into the sitemap, feeds, or
// llms.txt by accident. Flip `draft` to false in books.json to publish.
const books = JSON.parse(
  readFileSync(new URL("./books.json", import.meta.url), "utf8")
);

export default () => books.filter((book) => !book.draft);
