import { readFileSync } from "node:fs";

// Flattened chapter list for the chapter page template.
//
// A chapter only appears if BOTH its book and the chapter itself are published,
// so a finished chapter inside an unfinished book still stays private.
const books = JSON.parse(
  readFileSync(new URL("./books.json", import.meta.url), "utf8")
);

export default () =>
  books
    .filter((book) => !book.draft)
    .flatMap((book) =>
      (book.chapters || [])
        .filter((chapter) => !chapter.draft)
        .map((chapter) => ({
          ...chapter,
          bookSlug: book.slug,
          bookTitle: book.title,
        }))
    );
