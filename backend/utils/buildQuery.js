export function buildElasticQuery(query, size = 48, from = 0, sort = "desc") {
    if (query) {
      return {
        size,
        from,
        query: {
          multi_match: {
            query,
            fields: ["suchtext", "fotografen"],
          },
        },
      };
    } else {
      return {
        size,
        from,
        query: {
          match_all: {},
        },
        sort: [{ datum: sort }],
      };
    }
  }
  