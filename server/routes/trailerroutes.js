const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

async function getTrailerId(searchTerm) {
    const searchUrl = `https://www.youtube.com/results?search_query=${searchTerm}`;
    const res = await axios.get(`${searchUrl}`);
    const $ = cheerio.load(res.data);
    jsonData = JSON.parse($("script")[28].children[0].data.replace('var ytInitialData = ','').replace(']};', ']}'));
    const videoId = (jsonData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[1].videoRenderer.videoId);
    const youtubeLink = `https://www.youtube.com/embed/${videoId}`;
    // console.log(youtubeLink);
    return youtubeLink;
}

router.get("/trailer/:searchterm", async (req, res, next) => {
    // console.log("GET trailer for movie", req.params.searchterm);
    try {
        const videoSrc = await getTrailerId(req.params.searchterm);
        res.status(200).send(videoSrc);
    } catch (e) {
      console.log(e);
      res.status(200).send("https://www.youtube.com/embed");
    }
  });

module.exports = router;
