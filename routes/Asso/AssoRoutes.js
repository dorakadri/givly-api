const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://jamaity.org/associations/?region=tunisie&theme=agriculture";
const AssoRoutes = express.Router();

AssoRoutes.get("/", function (req, res) {
  res.json("This is my webscraper");
});

const articles = [];

AssoRoutes.get("/results", (req, res) => {
  const filteredData = articles.filter(
    (obj) => obj.title.trim() !== "" && obj.imgSrc.trim() !== ""
  );

  res.json(filteredData);
});
axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    // $('.h4', html).each(function () { //<-- cannot be a function expression
    //     const title = $(this).text()
    //     const url = $(this).find('a').attr('href')
    //     articles.push({
    //         title,
    //         url,
    //     })
    // })
    $("div.panel").each(function () {
      const href = $(this).find("a.text-left").attr("href");
      const title = $(this).find("a.text-left").text();
      const imgSrc = $(this).find("img").attr("src");
      const theme = "agriculture";
      articles.push({
        href,
        title,
        imgSrc,
        theme,
      });
    });
  })
  .catch((err) => console.log(err));
const secondUrl =
  "https://jamaity.org/associations/?region=tunisie&theme=aide-handicapes";
axios(secondUrl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "aide-handicapes";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});

const ThirdUrl =
  "https://jamaity.org/associations/?region=tunisie&theme=aide-humanitaire";
axios(ThirdUrl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "aide-humanitaire";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});

const FourthUrl =
  "https://jamaity.org/associations/?region=tunisie&theme=artisanat";
axios(FourthUrl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "artisanat";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});

const FifthUrl =
  "https://jamaity.org/associations/?region=tunisie&theme=artisanat";
axios(FifthUrl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "artisanat";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});
const SixthUrl =
  "https://jamaity.org/associations/?region=tunisie&theme=arts-culture";
axios(SixthUrl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "arts-culture";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});

const Sevenurl =
  "https://jamaity.org/associations/?region=tunisie&theme=association-pro";
axios(Sevenurl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "association-pro";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});

const Eighturl =
  "https://jamaity.org/associations/?region=tunisie&theme=cinema";
axios(Eighturl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "cinema";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});
const Nineurl =
  "https://jamaity.org/associations/?region=tunisie&theme=citoyennete";
axios(Nineurl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "citoyennete";
    articles.push({
      title,
      href,
      imgSrc,
      theme,
    });
  });
});

const Tenurl =
  "https://jamaity.org/associations/?region=tunisie&theme=citoyennete-gouvernance";
axios(Tenurl).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "citoyennete-gouvernance";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});

const Tenurll =
  "https://jamaity.org/associations/?region=tunisie&theme=droit-enfant";
axios(Tenurll).then((result) => {
  const html = result.data;
  const $ = cheerio.load(html);

  // Scrape the information from the second page using Cheerio
  $("div.panel").each(function () {
    const href = $(this).find("a.text-left").attr("href");
    const title = $(this).find("a.text-left").text();
    const imgSrc = $(this).find("img").attr("src");
    const theme = "droit-enfant";
    articles.push({
      href,
      title,
      imgSrc,
      theme,
    });
  });
});
module.exports = AssoRoutes;
