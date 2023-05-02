export const SET_CURRENT_PROFILE = "MUSA/PROFILE/SET_CURRENT_PROFILE";
export const updateCurrentProfile = (profile) => ({
  type: SET_CURRENT_PROFILE,
  profile,
});

const initialState = {
  currentProfile: "",
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_PROFILE: {
      return {
        currentProfile: action.profile,
      };
    }
    default:
      return state;
  }
};

export default profile;
