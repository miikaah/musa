import reducer, { addToast, removeToast } from "./toaster.reducer";

describe("Toaster reducer", () => {
  it("adds toast", () => {
    const message = "New toast";
    const key = "toast-key";

    expect(reducer(undefined, addToast(message, key))).toEqual({
      messages: {
        [key]: message,
      },
    });
  });

  it("removes toast", () => {
    const message = "New toast";
    const key = "toast-key";
    const state = {
      messages: {
        [key]: message,
      },
    };

    expect(reducer(state, removeToast(key))).toEqual({
      messages: {},
    });
  });

  it("can have multiple toasts", () => {
    expect(
      Object.keys(
        reducer({ messages: { key: "msg" } }, addToast("msg2", "key2"))
          .messages,
      ).length,
    ).toBe(2);
  });
});
