import { mapDb, padMediaId, generateImageUrl } from "./formatters.js";

describe("mapDb", () => {
  it("should map 'stock' to 'st'", () => {
    expect(mapDb("stock")).toBe("st");
  });

  it("should map 'sport' to 'sp'", () => {
    expect(mapDb("sport")).toBe("sp");
  });

  it("should default to 'st' for unknown values", () => {
    expect(mapDb("random")).toBe("st");
  });
});

describe("padMediaId", () => {
  it("should pad media ID to 10 digits", () => {
    expect(padMediaId("12345")).toBe("0000012345");
  });

  it("should return 10 zeros if empty", () => {
    expect(padMediaId("")).toBe("0000000000");
  });
});

describe("generateImageUrl", () => {
  it("should generate correct URL", () => {
    const url = generateImageUrl("stock", "123");
    expect(url).toBe("https://www.imago-images.de/bild/st/0000000123/s.jpg");
  });

  it("should default to 'st' for unknown db values", () => {
    const url = generateImageUrl("unknown", "1");
    expect(url).toBe("https://www.imago-images.de/bild/st/0000000001/s.jpg");
  });
});
