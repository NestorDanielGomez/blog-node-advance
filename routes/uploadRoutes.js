const AWS = require("aws-sdk");
const uuid = require("uuid");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
  region: "sa-east-1",
});

module.exports = (app) => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "blog-node-advanced-1",
        ContentType: "image/jpeg",
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
};
