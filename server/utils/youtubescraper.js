const cheerio = require("cheerio");
const axios = require("axios");

const { writeFileSync } = require("fs");


async function getTrailerId(searchTerm) {
    const searchUrl = `https://www.youtube.com/results?search_query=${searchTerm}`;
    const res = await axios.get(`${searchUrl}`);


    writeFileSync('youtube.html', res.data);
    const $ = cheerio.load(res.data);

    const resultScript = $("script").filter((i, script) => {
        if (script.children[0]){
            if (script.children[0].data)
                return script.children[0].data.includes("var ytInitialData");
        }
        return false;
        
    });
    // console.log(resultScript[0].children[0]);
    // console.log($("script")[27].children[0].data);

    // jsonData = JSON.parse($("script")[27].children[0].data.replace('var ytInitialData = ','').replace(']};', ']}'));
    jsonData = JSON.parse(resultScript[0].children[0].data.replace('var ytInitialData = ','').replace(']};', ']}'));

    const videoId = (jsonData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[1].videoRenderer.videoId);
    const youtubeLink = `https://www.youtube.com/embed/${videoId}`;
    console.log(youtubeLink);
    return youtubeLink;
}

getTrailerId("toy-story-1995-trailer");