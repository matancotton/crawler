const AWS = require("aws-sdk");
const { nanoid } = require("nanoid");
const redisClient = require("../db/redis");

const sqs = new AWS.SQS({
    apiVersion: "2012-11-05",
    region: process.env.AWS_REGION,
});

const createQueue = async (QueueName) => {
    try {
        const data = await sqs
            .createQueue({
                QueueName,
            })
            .promise();
        return data.QueueUrl;
    } catch (err) {
        throw err;
    }
};

// prettier-ignore
const sendWorkToQueue = async (QueueUrl,title, MessageBody) => {

    try {
        const { MessageId } = await sqs
            .sendMessage({
                QueueUrl,
                MessageAttributes: {
                    "title": {
                        DataType: "String",
                        StringValue: title,
                    },
                },
                MessageBody,
            })
            .promise();
    } catch (err) {
        throw err;
    }
};

const pullSites = async (QueueUrl) => {
    try {
        const { Messages } = await sqs
            .receiveMessage({
                QueueUrl,
                MaxNumberOfMessages: 10,
                MessageAttributeNames: ["All"],
                VisibilityTimeout: 30,
                WaitTimeSeconds: 1,
            })
            .promise();
        return Messages || [];
    } catch (err) {
        throw err;
    }
};

const deleteQueue = async (QueueUrl) => {
    try {
        await sqs.deleteQueue({ QueueUrl }).promise();
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    createQueue,
    sendWorkToQueue,
    pullSites,
    deleteQueue,
};
