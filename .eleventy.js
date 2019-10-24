module.exports = function (eleventyConfig) {
  return {
    templateFormats: [
      "html",
      "md",
      "css",
      "png"
    ]
  };
};

module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("posts", (collection) => {
    var _collection = collection.getFilteredByGlob("**/*.md").sort((a, b) => {
      if (a.inputPath < b.inputPath) return -1;
      else if (a.inputPath > b.inputPath) return 1;
      else return 0;
    })

    _collection.forEach(entry => entry.data.level = '_' + entry.inputPath.split('/').length)

    _collection.forEach(entry => entry.data.tag = entry.data.tags[0])

    return _collection;
  }
  );
};