import { addAttachment, getAttachment } from "../../src/services/file.service";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Task", () => ({
  Task: {
    findById: jest.fn(),
  },
}));

const mockedFindById = Task.findById as jest.Mock;

describe("file.service.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addAttachment()", () => {
    it(" should throw 'Task not found' when task is null", async () => {
      mockedFindById.mockResolvedValueOnce(null);

      await expect(
        addAttachment("task123", {
          filename: "a.txt",
          path: "/uploads/a.txt",
          size: 10,
          mimetype: "text/plain",
        } as any),
      ).rejects.toThrow("Task not found");
    });

    it("should create attachments array if missing and push file", async () => {
      const saveMock = jest.fn().mockResolvedValueOnce(true);

      const fakeTask: any = {
        attachments: undefined, // 🔥 triggers branch: if (!task.attachments)
        save: saveMock,
      };

      mockedFindById.mockResolvedValueOnce(fakeTask);

      const file = {
        filename: "test-file.txt",
        path: "/uploads/test-file.txt",
        size: 123,
        mimetype: "text/plain",
      } as any;

      const result = await addAttachment("task123", file);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result.attachments).toBeDefined();
      expect(result.attachments.length).toBe(1);
      expect(result.attachments[0]).toMatchObject({
        filename: "test-file.txt",
        path: "/uploads/test-file.txt",
        size: 123,
        mimetype: "text/plain",
      });
    });

    it(" should push file when attachments already exists", async () => {
      const saveMock = jest.fn().mockResolvedValueOnce(true);

      const fakeTask: any = {
        attachments: [],
        save: saveMock,
      };

      mockedFindById.mockResolvedValueOnce(fakeTask);

      const file = {
        filename: "b.txt",
        path: "/uploads/b.txt",
        size: 50,
        mimetype: "text/plain",
      } as any;

      const result = await addAttachment("task123", file);

      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result.attachments.length).toBe(1);
      expect(result.attachments[0].filename).toBe("b.txt");
    });
  });

  describe("getAttachment()", () => {
    it(" should throw 'Task not found' when task is null", async () => {
      mockedFindById.mockResolvedValueOnce(null);

      await expect(getAttachment("task123", "att123")).rejects.toThrow(
        "Task not found",
      );
    });

    it(" should throw 'No attachments found' when attachments missing", async () => {
      const fakeTask: any = {
        attachments: undefined, // 🔥 triggers: if (!task.attachments)
      };

      mockedFindById.mockResolvedValueOnce(fakeTask);

      await expect(getAttachment("task123", "att123")).rejects.toThrow(
        "No attachments found",
      );
    });

    it(" should throw 'Attachment not found' when id() returns null", async () => {
      const fakeTask: any = {
        attachments: {
          id: jest.fn().mockReturnValueOnce(null), // 🔥 triggers: if (!attachment)
        },
      };

      mockedFindById.mockResolvedValueOnce(fakeTask);

      await expect(getAttachment("task123", "att123")).rejects.toThrow(
        "Attachment not found",
      );
    });

    it(" should return attachment when found", async () => {
      const fakeAttachment = {
        filename: "found.txt",
        path: "/uploads/found.txt",
        size: 10,
        mimetype: "text/plain",
      };

      const fakeTask: any = {
        attachments: {
          id: jest.fn().mockReturnValueOnce(fakeAttachment),
        },
      };

      mockedFindById.mockResolvedValueOnce(fakeTask);

      const result = await getAttachment("task123", "att123");

      expect(result).toBe(fakeAttachment);
    });
  });
});
