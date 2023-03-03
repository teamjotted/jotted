const urlMetadata = require("url-metadata");

export default async function handler(req, res) {
  try {
    const response = await urlMetadata(req.body).then((res) => {
      console.log(res);
      return res;
    });
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "failed to create url!" });
  }
}
