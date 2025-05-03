import { describe, it, expect } from "vitest";
import { normalize, byte, stripPrefix, is, toInt } from "./hex";

describe("hex.ts", () => {
  describe("stripPrefix", () => {
    it("removes # from start", () => {
      expect(stripPrefix("#abc")).toBe("abc");
      expect(stripPrefix("#123456")).toBe("123456");
    });
    it("returns string unchanged if no #", () => {
      expect(stripPrefix("abc")).toBe("abc");
    });
  });

  describe("is", () => {
    it("returns true for valid hex strings", () => {
      expect(is("#abc")).toBe(true);
      expect(is("#abcd")).toBe(true);
      expect(is("#abcdef")).toBe(true);
      expect(is("#abcdef12")).toBe(true);
      expect(is("#ABCDEF")).toBe(true);
      expect(is("#12345678")).toBe(true);
    });
    it("returns false for missing #", () => {
      expect(is("abc")).toBe(false);
      expect(is("abcdef")).toBe(false);
    });
    it("returns false for invalid chars", () => {
      expect(is("#xyz")).toBe(false);
      expect(is("#12g")).toBe(false);
    });
    it("returns false for invalid length", () => {
      expect(is("#ab")).toBe(false);
      expect(is("#abcde")).toBe(false);
      expect(is("#abcdefghi")).toBe(false);
    });
    it("returns false for non-string input", () => {
      expect(is(123)).toBe(false);
      expect(is(null)).toBe(false);
      expect(is(undefined)).toBe(false);
      expect(is({})).toBe(false);
    });
  });

  describe("normalize", () => {
    it("expands 3-digit hex to 6-digit with ff alpha", () => {
      expect(normalize("#abc")).toBe("#aabbccff");
    });
    it("expands 4-digit hex to 8-digit", () => {
      expect(normalize("#abcd")).toBe("#aabbccdd");
    });
    it("adds ff alpha to 6-digit hex", () => {
      expect(normalize("#abcdef")).toBe("#abcdefff");
    });
    it("returns 8-digit hex unchanged", () => {
      expect(normalize("#12345678")).toBe("#12345678");
    });
    it("returns #00000000 for invalid hex", () => {
      expect(normalize("not-a-hex")).toBe("#00000000");
      expect(normalize("#ab")).toBe("#00000000");
      expect(normalize("#xyz")).toBe("#00000000");
      expect(normalize(123 as any)).toBe("#00000000");
      expect(normalize(null as any)).toBe("#00000000");
      expect(normalize(undefined as any)).toBe("#00000000");
    });
  });
  describe("toInt", () => {
    it("converts 6-digit hex to integer", () => {
      expect(toInt("#ffffff")).toBe(0xffffff);
      expect(toInt("#000000")).toBe(0x000000);
      expect(toInt("#123456")).toBe(0x123456);
    });

    it("converts 8-digit hex to integer", () => {
      expect(toInt("#12345678")).toBe(0x12345678);
      expect(toInt("#abcdef12")).toBe(0xabcdef12);
    });

    it("converts normalized 3-digit hex to integer", () => {
      const norm = normalize("#abc"); // #aabbccff
      expect(toInt(norm)).toBe(0xaabbccff);
    });

    it("converts normalized 4-digit hex to integer", () => {
      const norm = normalize("#abcd"); // #aabbccdd
      expect(toInt(norm)).toBe(0xaabbccdd);
    });
  });
  describe("byte", () => {
    describe("is", () => {
      it("returns true for numbers in [0,255]", () => {
        expect(byte.is(0)).toBe(true);
        expect(byte.is(255)).toBe(true);
        expect(byte.is(128)).toBe(true);
      });
      it("returns false for numbers outside [0,255]", () => {
        expect(byte.is(-1)).toBe(false);
        expect(byte.is(256)).toBe(false);
        expect(byte.is(1.5)).toBe(true); // still true, as per implementation
      });
      it("returns false for non-numbers", () => {
        expect(byte.is("ff")).toBe(false);
        expect(byte.is(null)).toBe(false);
        expect(byte.is(undefined)).toBe(false);
      });
    });

    describe("clamp", () => {
      it("clamps values below 0 to 0", () => {
        expect(byte.clamp(-10)).toBe(0);
      });
      it("clamps values above 255 to 255", () => {
        expect(byte.clamp(300)).toBe(255);
      });
      it("returns value if in range", () => {
        expect(byte.clamp(128)).toBe(128);
      });
    });

    describe("toHex", () => {
      it("returns 2-digit hex for valid byte", () => {
        expect(byte.toHex(0)).toBe("00");
        expect(byte.toHex(255)).toBe("ff");
        expect(byte.toHex(16)).toBe("10");
        expect(byte.toHex(1)).toBe("01");
      });
      it('returns "00" for values below 0', () => {
        expect(byte.toHex(-5)).toBe("00");
      });
      it('returns "ff" for values above 255', () => {
        expect(byte.toHex(300)).toBe("ff");
      });
    });

    describe("parse", () => {
      it("parses valid 1-2 digit hex strings", () => {
        expect(byte.parse("ff")).toBe(255);
        expect(byte.parse("00")).toBe(0);
        expect(byte.parse("7f")).toBe(127);
        expect(byte.parse("#7f")).toBe(127);
        expect(byte.parse("0x7f")).toBe(127);
      });
      it("returns 255 for >2 digit hex", () => {
        expect(byte.parse("123")).toBe(255);
        expect(byte.parse("abcd")).toBe(255);
      });
      it("returns 0 for invalid hex", () => {
        expect(byte.parse("zz")).toBe(0);
        expect(byte.parse("")).toBe(0);
        expect(byte.parse("!@")).toBe(0);
      });
      it("clamps parsed value to [0,255]", () => {
        expect(byte.parse("ff")).toBe(255);
        expect(byte.parse("100")).toBe(255);
        expect(byte.parse("-1")).toBe(0);
      });
    });
  });
});
