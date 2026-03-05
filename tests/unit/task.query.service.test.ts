import {
  buildFilters,
  buildSort,
  getTasksOffset,
} from "../../src/services/task.query.service";

describe("Task Query Service", () => {
  describe("buildFilters", () => {
    it("should build filters with default deletedAt not exists", () => {
      const result = buildFilters({});
      expect(result).toEqual({
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      });
    });

    it("should add projectId to filter when provided", () => {
      const result = buildFilters({ projectId: "proj123" });
      expect(result).toEqual({
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        projectId: "proj123",
      });
    });

    it("should add status to filter when provided", () => {
      const result = buildFilters({ status: "todo" });
      expect(result).toEqual({
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        status: "todo",
      });
    });

    it("should add multiple filters", () => {
      const result = buildFilters({ status: "todo", priority: "high" });
      expect(result).toEqual({
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        status: "todo",
        priority: "high",
      });
    });
  });
});
describe("buildSort", () => {
  it("should default to createdAt desc", () => {
    const result = buildSort();
    expect(result).toEqual({ createdAt: -1, _id: -1 });
  });

  it("should sort by specified field", () => {
    const result = buildSort("dueDate", "asc");
    expect(result).toEqual({ dueDate: 1, _id: 1 });
  });

  it("should sort by priority desc", () => {
    const result = buildSort("priority", "desc");
    expect(result).toEqual({ priority: -1, _id: -1 });
  });
});
