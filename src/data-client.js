const AWS = require('aws-sdk');

function DataClient(settings) {

    function getS3Params() {
        return {
            Bucket: settings.s3Bucket,
            Key: settings.s3ObjectKey
        };
    }

    function dataFactory() {
        AWS.config.update(
            {
                accessKeyId: settings.pub,
                secretAccessKey: settings.priv,
                region: 'us-east-1'
            }
        );
        return new AWS.S3();
    }

    this.getData = async function () {
        return dataFactory().getObject(getS3Params()).promise();
    }

}

module.exports = DataClient;
