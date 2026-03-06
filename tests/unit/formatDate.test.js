"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatDate_1 = require("@/utils/formatDate");
describe("formatDate utility", () => {
    it("should return ISO string", () => {
        const date = new Date();
        expect((0, formatDate_1.formatDate)(date)).toBe(date.toISOString());
    });
});
