import reducer, { updateCurrentProfile } from "./profile.reducer";

describe("Profile reducer", () => {
  it("updates current profile", () => {
    const profile = "foo@bar.app";

    expect(reducer(undefined, updateCurrentProfile(profile))).toEqual({
      currentProfile: profile,
    });
  });
});
