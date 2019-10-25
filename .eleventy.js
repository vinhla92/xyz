module.exports = function (eleventyConfig) {

  let markdownIt = require("markdown-it");
  
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }));

  eleventyConfig.addPassthroughCopy('**/*.png');

  eleventyConfig.addCollection('posts', collection => {

    const _collection = collection.getFilteredByGlob('**/*.md').sort((a, b) => {
      if (a.inputPath < b.inputPath) return -1;
      else if (a.inputPath > b.inputPath) return 1;
      else return 0;
    })

    _collection.forEach(entry => entry.data.level = entry.inputPath.split('/').length)

    _collection.forEach(entry => entry.data.tag = entry.data.tags[0])

    return _collection;
  });

};