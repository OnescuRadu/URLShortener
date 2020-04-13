const addHttp = url => {
  var pattern = /^((http|https):\/\/)/;

  if (!pattern.test(url)) {
    url = 'http://' + url;
  }

  return url;
};

module.exports = { addHttp };
