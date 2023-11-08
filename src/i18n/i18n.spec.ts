import { translate } from "./i18n";

describe("i18n", () => {
  it("returns t as function", () => {
    const t = translate("en");

    expect(typeof t).toBe("function");
  });

  it("returns en translation as fallback", () => {
    const t = translate("fi");

    expect(t("test.onlyExistsInEnglish")).toBe("mock");
  });

  it("returns 'Translation not found' as fallback", () => {
    const t = translate("en");

    expect(t("test.notExists")).toBe("Translation not found");
  });
});
