const AWS = require("aws-sdk");
const { message } = require("statuses");

const sqs = new AWS.SQS({
    apiVersion: "2012-11-05",
    region: "eu-west-1",
});

const getLinkFromQueue = async (QueueUrl) => {
    try {
        const { Messages } = await sqs
            .receiveMessage({
                QueueUrl,
                MaxNumberOfMessages: 1,
                MessageAttributeNames: ["All"],
                VisibilityTimeout: 30,
                WaitTimeSeconds: 1,
            })
            .promise();
        return Messages || null;
    } catch (err) {
        console.log(err.message);
    }
};

const deleteMessagesFromQueue = async (Messages, QueueUrl) => {
    if (Messages) {
        const messagesDeleteFuncs = Messages.map((message) => {
            return sqs
                .deleteMessage({
                    QueueUrl,
                    ReceiptHandle: message.ReceiptHandle,
                })
                .promise();
        });

        await Promise.allSettled(messagesDeleteFuncs);
    }
};
// prettier-ignore
const sendLinkToQueue = async (queueUrl, url, address) => {
    const QueueUrl = queueUrl;
    const title = url;
    const MessageBody = JSON.stringify(address);
    try {
        const { MessageId } = await sqs
            .sendMessage({
                QueueUrl,
                MessageAttributes: {
                    title: {
                        DataType: "String",
                        StringValue: title,
                    },
                },
                MessageBody,
            })
            .promise();
        // req.messageId = MessageId;
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = {
    getLinkFromQueue,
    sendLinkToQueue,
    deleteMessagesFromQueue,
};
