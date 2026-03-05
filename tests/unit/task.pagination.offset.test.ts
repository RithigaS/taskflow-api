import { getTasksOffset } from "../../src/services/task.query.service";
import { Task } from "../../src/models/Task";

describe("Offset Pagination - Unit Tests", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("should calculate totalPages correctly when total = 0", async () => {
    jest.spyOn(Task, "countDocuments").mockResolvedValue(0 as any);
    jest.spyOn(Task, "find").mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve([]),
        }),
      }),
    } as any);

    const result: any = await getTasksOffset({ page: "1", limit: "5" });

    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
    expect(result.meta.hasMore).toBe(false);
  });

  it("should calculate totalPages correctly for exact multiples", async () => {
    jest.spyOn(Task, "countDocuments").mockResolvedValue(10 as any);
    jest.spyOn(Task, "find").mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve([{}, {}, {}, {}, {}]),
        }),
      }),
    } as any);

    const result: any = await getTasksOffset({ page: "1", limit: "5" });

    expect(result.meta.totalPages).toBe(2);
    expect(result.meta.hasMore).toBe(true);
  });

  it("should calculate totalPages correctly for partial pages", async () => {
    jest.spyOn(Task, "countDocuments").mockResolvedValue(11 as any);
    jest.spyOn(Task, "find").mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve([{}, {}, {}, {}, {}]),
        }),
      }),
    } as any);

    const result: any = await getTasksOffset({ page: "1", limit: "5" });

    expect(result.meta.totalPages).toBe(3);
    expect(result.meta.hasMore).toBe(true);
  });

  it("should return empty results if page is beyond totalPages", async () => {
    jest.spyOn(Task, "countDocuments").mockResolvedValue(5 as any);
    jest.spyOn(Task, "find").mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => Promise.resolve([]),
        }),
      }),
    } as any);

    const result: any = await getTasksOffset({ page: "5", limit: "5" });

    expect(result.data).toEqual([]);
    expect(result.meta.hasMore).toBe(false);
  });
});
