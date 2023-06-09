exports.slugify = (text) => {
  if (text) {
    return text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  } else {
    return;
  }
};




exports.spaceReducer = (text) => {
  if (text) {
    return text
      .toLowerCase()
      .replace(/ /g, "-")
  } else {
    return;
  }
};