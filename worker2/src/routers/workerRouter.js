const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const redisClient = require("../db/redis");
const {
    getLinkFromQueue,
    sendLinkToQueue,
    deleteMessagesFromQueue,
} = require("../middleware/sqs");
const router = new express.Router();

router.post("/work-url", async (req, res) => {
    res.send();
    const queueUrl = req.body.queueUrl;
    let messages = await getLinkFromQueue(queueUrl);
    while (messages?.length > 0) {
        const url = messages[0].MessageAttributes.title.StringValue;
        const address = JSON.parse(messages[0].Body);
        try {
            const result = await axios.get(url);
            let $ = cheerio.load(result.data);
            const title = $("title").text();
            const links = [];
            $("a").each((i, e) => {
                if (!!$(e).attr("href") && $(e).attr("href").length > 0) {
                    links.push($(e).attr("href"));
                }
            });
            const node = {
                title,
                links,
                href: url,
            };
            await redisClient.setAsync(url, JSON.stringify(node));
            await axios.post(process.env.SERVER_URL + "/update-tree", {
                key: url,
                queueUrl: req.body.queueUrl,
                address,
            });
        } catch (err) {
            console.log(err.message);
            await axios.post(process.env.SERVER_URL + "/update-tree", {
                key: null,
                queueUrl: req.body.queueUrl,
                address,
            });
        } finally {
            await deleteMessagesFromQueue(messages, queueUrl);
            messages = await getLinkFromQueue(queueUrl);
        }
    }
});

module.exports = router;
