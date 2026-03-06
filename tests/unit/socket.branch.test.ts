import { getIO } from "../../src/socket";

describe("socket branch", () => {
  test("getIO throws error if socket not initialized", () => {
    expect(() => getIO()).toThrow("Socket.io not initialized");
  });
});
