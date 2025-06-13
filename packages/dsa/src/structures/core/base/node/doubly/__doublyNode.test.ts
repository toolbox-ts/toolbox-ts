import { describe, it, expect } from "vitest";
import { create as createDoubly } from "./doubly";

type AK = "head";
interface D {
  value: number;
}

describe("doubly node manager", () => {
  const cfg = { anchorKeys: ["head"] as [AK, ...AK[]] };

  it("creates nodes and manages anchors", () => {
    const api = createDoubly<AK, D>(cfg);

    const n1 = api.create({ id: "a", data: { value: 1 } });
    const n2 = api.create({ id: "b", data: { value: 2 } });
    const n3 = api.create({ id: "c", data: { value: 3 } });

    api.setPointer(n1, { next: n2 });
    api.setPointer(n2, { prev: n1, next: n3 });
    api.setPointer(n3, { prev: n2 });

    api.anchors.set(api.anchors.primaryKey, n1);

    expect(api.anchors.primary).toBe(n1);
    expect(api.pointerKeys).toEqual(["next", "prev"]);
    expect(api.type).toBe("doubly");
  });
});
