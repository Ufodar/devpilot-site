module.exports = function (eleventyConfig) {
  // Passthrough CSS
  eleventyConfig.addPassthroughCopy("src/css");

  // Date filter for articles
  eleventyConfig.addFilter("dateDisplay", function (dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Get all articles sorted by date descending
  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articles/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Sitemap collection
  eleventyConfig.addCollection("sitemap", function (collectionApi) {
    return collectionApi.getAllSorted();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
