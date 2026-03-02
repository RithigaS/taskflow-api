import { formatDate } from "@/utils/formatDate";

describe("formatDate utility", () => {
  it("should return ISO string", () => {
    const date = new Date();
    expect(formatDate(date)).toBe(date.toISOString());
  });
});
