const expressAsyncHandler = require("express-async-handler");

const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDiyCrafts(objectName) {
  const url = `https://www.diyncrafts.com/?s=${objectName.replace(' ', '+')}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const crafts = [];
  $('article').each((i, el) => {
    const title = $(el).find('h2').text().trim();
    const link = $(el).find('a').attr('href');
    let imgUrl = null;
    const img = $(el).find('a.entry-image-link img');
    if (img.length > 0) {
      imgUrl = img.attr('src');
    }

    crafts.push({ title, link, imgUrl });
  });

  return JSON.stringify(crafts);
}

const Diyfetching = expressAsyncHandler(async (req, res) => {
    const { objectname } = req.params;

    scrapeDiyCrafts(objectname)
      .then(result => {
        const crafts = JSON.parse(result);
        res.json(crafts);
      })
      .catch(err =>   res.json(err));
  });

  module.exports = {

    Diyfetching,
 
  };