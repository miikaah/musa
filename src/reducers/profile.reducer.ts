export const UPDATE_CURRENT_PROFILE =
  "MUSA/PROFILE/UPDATE_CURRENT_PROFILE" as const;
export const updateCurrentProfile = (profile?: string) => ({
  type: UPDATE_CURRENT_PROFILE,
  profile,
});

export type ProfileState = {
  currentProfile: string;
};

const initialState: ProfileState = {
  currentProfile: "",
};

const profile = (
  state = initialState,
  action: ReturnType<typeof updateCurrentProfile>,
) => {
  switch (action.type) {
    case UPDATE_CURRENT_PROFILE: {
      return {
        currentProfile: action.profile,
      };
    }
    default:
      return state;
  }
};

export default profile;
