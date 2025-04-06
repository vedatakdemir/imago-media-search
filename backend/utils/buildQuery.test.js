import { buildElasticQuery } from "./buildQuery.js";

describe("buildElasticQuery", () => {
  it("should build a multi_match query when query is provided", () => {
    const result = buildElasticQuery("test", 10, 5, "asc");

    expect(result).toEqual({
      size: 10,
      from: 5,
      query: {
        multi_match: {
          query: "test",
          fields: ["suchtext", "fotografen"],
        },
      },
    });
  });

  it("should build a match_all query when no query is provided", () => {
    const result = buildElasticQuery("", 20, 0, "desc");

    expect(result).toEqual({
      size: 20,
      from: 0,
      query: {
        match_all: {},
      },
      sort: [{ datum: "desc" }],
    });
  });
});
