import reducer, { updateSettings, initialState } from "./settings.reducer";

describe("Settings reducer", () => {
  it("updates settings", () => {
    const settings = {
      isInit: true,
    };

    expect(reducer(initialState, updateSettings(settings))).toEqual({
      ...initialState,
      isInit: true,
    });
  });

  it("changes language", () => {
    const settings = {
      language: "fi" as const,
    };

    const result = reducer(initialState, updateSettings(settings));

    expect(result.language).toEqual("fi");
    expect(result.t("coverInfo.metadata.bitRate")).toEqual("Bittinopeus");
  });
});
