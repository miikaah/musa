import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MusicLibrarySetting from "./MusicLibrarySetting";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import Api from "../../apiClient";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

vi.mock("../../apiClient");
vi.mocked(Api.addMusicLibraryPath).mockResolvedValue("/path");

const t = translate("en");
const addNewButtonText = String(t("settings.library.addNew"));

const state = {
  settings: {
    t,
    musicLibraryPath: "",
  },
};

const state2 = {
  settings: {
    t,
    musicLibraryPath: "/music",
  },
};

describe("MusicLibrarySetting", () => {
  it("renders MusicLibrarySetting component", async () => {
    render(<MusicLibrarySetting />, state);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByTestId("MusicLibrarySettingRemoveButton"),
    ).toBeInTheDocument();
    expect(screen.getByText(addNewButtonText)).toBeInTheDocument();
  });

  it("disables remove button when music library path is empty", async () => {
    render(<MusicLibrarySetting />, state);

    expect(
      screen.getByTestId<HTMLButtonElement>("MusicLibrarySettingRemoveButton")
        .disabled,
    ).toBe(true);
  });

  it("enables remove button when music library path exists", async () => {
    render(<MusicLibrarySetting />, state2);

    expect(
      screen.getByTestId<HTMLButtonElement>("MusicLibrarySettingRemoveButton")
        .disabled,
    ).toBe(false);
  });

  it("enables add button when music library path is empty", async () => {
    render(<MusicLibrarySetting />, state);

    expect(screen.getByText<HTMLButtonElement>(addNewButtonText).disabled).toBe(
      false,
    );
  });

  it("disables add button when music library path exists", async () => {
    render(<MusicLibrarySetting />, state2);

    expect(screen.getByText<HTMLButtonElement>(addNewButtonText).disabled).toBe(
      true,
    );
  });

  it("dispatches remove music library path action", async () => {
    render(<MusicLibrarySetting />, state2);

    await userEvent.click(
      screen.getByTestId("MusicLibrarySettingRemoveButton"),
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ props: { musicLibraryPath: "" } }),
    );
  });

  it("calls api and dispatches add music library path action thunk", async () => {
    render(<MusicLibrarySetting />, state);

    await userEvent.click(screen.getByText(addNewButtonText));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ props: { musicLibraryPath: "/path" } }),
    );
  });
});
