// Directory data for the Data series.
//
// Same draft mechanism as the blog: `draft: true` must set `permalink: false`,
// or the page still renders to disk and lands in the sitemap even though it's
// excluded from every listing.
export default {
  layout: "layouts/data-post.njk",
  series: "data",

  eleventyComputed: {
    permalink: (data) => (data.draft ? false : data.permalink),
    eleventyExcludeFromCollections: (data) =>
      data.draft ? true : data.eleventyExcludeFromCollections,
  },
};
