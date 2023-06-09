const aws = require("aws-sdk");

//#region aws Setup

const AWSConfig = {
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
};

//#endregion
aws.config.update(AWSConfig);

//#region s3 setup
const spacesEndpoint = new aws.Endpoint(``);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});
exports.getS3 = () => {
  return s3;
};
//#endregion
