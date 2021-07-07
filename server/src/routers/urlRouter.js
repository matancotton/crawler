const express = require("express");
const Axios = require("axios");
const cheerio = require("cheerio");
const redisClient = require("../db/redis");
const { nanoid } = require("nanoid");
const {
    createQueue,
    sendWorkToQueue,
    pullSites,
    deleteQueue,
} = require("../middleware/sqs");
// const { Braket } = require("aws-sdk");
// const { Node, insertNode } = require("../dataStructure/tree");
const { startCrawler, addNodeToTree, returnTree, isDoneScraping, isDepthDone, addChildrenToSqs } = require("../utils/utils");

const router = new express.Router();

router.post("/", async (req, res) => {
    try {
        const startUrl = req.body.startUrl;
        const depth = req.body.depth;
        const maxPages = req.body.max;
        const queueName = nanoid()
        const queueUrl = await createQueue(queueName);
        await startCrawler(queueUrl, startUrl, depth, maxPages);
        res.send("ok");
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: err.message });
    }
});

router.get("/get-data", async (req, res) => {
    try {
        const value = returnTree()
        if (!value) return res.send({value: null, isDone: false});
        const isDone = !(await isDoneScraping());
        res.send({value, isDone})
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ error: err.message });
    }
});

router.post("/update-tree", async (req, res) => {
    try {
        res.send()
        const queueUrl = req.body.queueUrl;
        let node = await redisClient.getAsync(req.body.key || "")
        if (req.body.key == null)
            node = null
        const address = req.body.address;
        const depth = req.body.address.length -1
        addNodeToTree(node, address, depth)
        if (isDepthDone()) {
            if (!(await isDoneScraping(depth))) {
                console.log("done")
                await addChildrenToSqs(depth)
                await Axios.post(process.env.WORKER_URL + "/work-url", {
                queueUrl,
                });
            }
        }
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;
