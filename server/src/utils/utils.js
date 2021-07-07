const { nanoid } = require("nanoid");
const { Tree, Node } = require("../dataStructure/tree");
const {
    sendWorkToQueue,
    pullSites,
    deleteQueue,
} = require("../middleware/sqs");

const Axios = require("axios");

let tree;
let workCounter;
let depthOfCrawler;
let maxPages;
let queueUrl;
let isWorking;

const startCrawler = async (queueUrlParam, startUrl, depth, max) => {
    tree = new Tree();
    depthOfCrawler = depth;
    queueUrl = queueUrlParam;
    maxPages = max;
    isWorking = true;
    try {
        await sendWorkToQueue(queueUrl, startUrl, JSON.stringify([0]));
        await Axios.post(process.env.WORKER_URL + "/work-url", {
            queueUrl,
            depth: 0,
        });
        workCounter = 1;
    } catch (err) {
        console.log(err.message);
    }
};

const addNodeToTree = (data, address, depth) => {
    if (maxPages <= 0) return;
    tree.insertNode(data, address, depth);
    workCounter--;
    if (data != null) maxPages--;
};

const returnTree = () => {
    return tree;
};

const setArrayOfChilds = (depth) => {
    let currentNode = tree.getTree();
    let queue = [];
    let children = [];
    queue.push(currentNode);
    while (queue.length > 0) {
        currentNode = queue.shift();
        children.push(currentNode);
        for (let child of currentNode.children) {
            queue.push(child);
        }
    }
    console.log(children.map((node) => node.address));
    children = children.filter((node) => node.depth === depth);
    return children;
};

const addChildrenToSqs = async (depth) => {
    try {
        workCounter = 0;
        let children = setArrayOfChilds(depth);
        for (let node of children) {
            const data = JSON.parse(node.data);
            if (node.data == null) continue;
            data.links.forEach(async (link, i) => {
                try {
                    workCounter++;
                    await sendWorkToQueue(
                        queueUrl,
                        link,
                        JSON.stringify(node.address.concat(i))
                    );
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
    } catch (err) {
        console.log(err.message);
    }
};

const isDepthDone = () => {
    try {
        if (workCounter === 0 || maxPages <= 0) return true;
        return false;
    } catch (err) {
        console.log(err.message);
        return false;
    }
};

const isDoneScraping = async (depth) => {
    if (depth == null) return isWorking;
    depth += 1;
    console.log(depth, depthOfCrawler);
    if (depth >= depthOfCrawler || maxPages <= 0) {
        console.log("finish total");
        isWorking = false;
        try {
            await deleteQueue(queueUrl);
            return true;
        } catch (err) {
            console.log(err.message);
            return true;
        }
    }
    return false;
};

module.exports = {
    startCrawler,
    addNodeToTree,
    isDepthDone,
    addChildrenToSqs,
    returnTree,
    isDoneScraping,
};

// let tree = new Tree()

// tree.insertNode("a", [0], 0)
// tree.insertNode("aa", [0,0],1)
// tree.insertNode("aaa", [0,0,0],2)
// tree.insertNode("ab" , [0,1],1)

// tree.insertNode("aba", [0,1,0] ,2)
// console.log(addChildrenToSqs(2))
