import { getTasksCursor } from "../../src/services/task.query.service";
import { Task } from "../../src/models/Task";

describe("Cursor Pagination - Unit Tests", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("should return correct nextCursor + hasMore", async () => {
    // Return limit+1 items to trigger hasMore = true
    // The service calls limit(limit+1), so for limit=3 it calls limit(4)
    const fakeTasks = [
      {
        _id: "507f1f77bcf86cd799439011",
        createdAt: new Date("2024-01-01"),
        priority: 1,
      },
      {
        _id: "507f1f77bcf86cd799439012",
        createdAt: new Date("2024-01-02"),
        priority: 2,
      },
      {
        _id: "507f1f77bcf86cd799439013",
        createdAt: new Date("2024-01-03"),
        priority: 3,
      },
      {
        _id: "507f1f77bcf86cd799439014",
        createdAt: new Date("2024-01-04"),
        priority: 4,
      },
    ];

    // Mock returns 4 items when limit(4) is called (limit+1 when limit=3)
    jest.spyOn(Task, "find").mockReturnValue({
      sort: () => ({
        limit: () => Promise.resolve(fakeTasks),
      }),
    } as any);

    const result: any = await getTasksCursor({ limit: "3" });

    expect(result.meta.limit).toBe(3);
    // Should have nextCursor since there's more data
    expect(result.meta.nextCursor).toBeDefined();
    // hasMore should be true because we got 4 items when requesting 3
    expect(result.meta.hasMore).toBe(true);
    // Data should have only 3 items (one removed for hasMore check)
    expect(result.data.length).toBe(3);
  });

  it("should return hasMore false when no more data", async () => {
    // Return exactly limit items - no more data
    const fakeTasks = [
      {
        _id: "507f1f77bcf86cd799439011",
        createdAt: new Date("2024-01-01"),
        priority: 1,
      },
      {
        _id: "507f1f77bcf86cd799439012",
        createdAt: new Date("2024-01-02"),
        priority: 2,
      },
      {
        _id: "507f1f77bcf86cd799439013",
        createdAt: new Date("2024-01-03"),
        priority: 3,
      },
    ];

    jest.spyOn(Task, "find").mockReturnValue({
      sort: () => ({
        limit: () => Promise.resolve(fakeTasks),
      }),
    } as any);

    const result: any = await getTasksCursor({ limit: "3" });

    expect(result.meta.limit).toBe(3);
    expect(result.meta.hasMore).toBe(false);
    expect(result.data.length).toBe(3);
  });
});
