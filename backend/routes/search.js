import dotenv from "dotenv";
import express from "express";
import https from "https";
import fetch from "node-fetch";
import { buildElasticQuery } from "../utils/buildQuery.js";
import { generateImageUrl } from "../utils/formatters.js";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q || "";
  const size = parseInt(req.query.size) || 48;
  const from = parseInt(req.query.from) || 0;
  const sort = req.query.sort === "asc" ? "asc" : "desc";

  const elasticUrl = `${process.env.ELASTIC_HOST}/imago/_search`;

  const body = buildElasticQuery(query, size, from, sort);

  try {
    const response = await fetch(elasticUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.ELASTIC_USERNAME}:${process.env.ELASTIC_PASSWORD}`
          ).toString("base64"),
      },
      body: JSON.stringify(body),
      agent: new https.Agent({ rejectUnauthorized: false }),
    });

    const result = await response.json();
    const hits = result.hits?.hits || [];

    const media = hits.map((hit) => {
      const source = hit._source;

      return {
        id: source.bildnummer || "",
        title: source.suchtext || "",
        photographer: source.fotografen || "",
        date: source.datum || "",
        imageUrl: generateImageUrl(source.db, source.bildnummer),
      };
    });

    res.json({
      results: media,
      total: result.hits?.total?.value || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch from Elasticsearch" });
  }
});

export default router;
