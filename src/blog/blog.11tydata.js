// Directory data for src/blog — applies to every post.
//
// `draft: true` in front matter must do more than hide a post from the posts
// collection: without `permalink: false` the page still renders to disk and
// shows up in the sitemap, so a draft would deploy as a live, crawlable URL.
export default {
  layout: "layouts/post.njk",

  eleventyComputed: {
    permalink: (data) => (data.draft ? false : data.permalink),
    eleventyExcludeFromCollections: (data) =>
      data.draft ? true : data.eleventyExcludeFromCollections,
  },
};
