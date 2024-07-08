import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Titlebar from "./Titlebar";
import { artistFixture } from "../../fixtures/artist.fixture";
import { playlistFixture } from "../../fixtures/playlist.fixture";
import { translate } from "../../i18n";
import { render } from "../../../test/render";
import { dispatchToast } from "../../util";
import * as Api from "../../apiClient";

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-redux")),
  useDispatch: () => mockDispatch,
}));

let mockLocation = { pathname: "/" };
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-router-dom")),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

vi.mock("../../util", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("../../util")),
  dispatchToast: vi.fn(),
}));

vi.mock("../../apiClient");
vi.mocked(Api.insertPlaylist).mockResolvedValue(playlistFixture);

document.execCommand = vi.fn();

const state = {
  player: { items: artistFixture.albums[0].files },
  settings: { t: translate("en") },
};

describe("Titlebar", () => {
  describe("when web version", () => {
    afterEach(() => {
      mockLocation = { pathname: "/" };
    });

    it("renders Titlebar component", async () => {
      render(<Titlebar />, state);

      expect(screen.getByTestId("TitlebarLibraryButton")).toBeInTheDocument();
      expect(
        screen.getByTestId("TitlebarVisualizerButton"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarSearchButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarShareButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarSettingsButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarLocation")).toBeInTheDocument();
    });

    it("clicks library button", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarLibraryButton"));
    });

    it("clicks library button when not in root and navigates to root", async () => {
      mockLocation = { pathname: "/search" };

      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarLibraryButton"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("clicks visualizer button", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarVisualizerButton"));
    });

    it("clicks visualizer button when not in root and navigates to root", async () => {
      mockLocation = { pathname: "/search" };

      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarVisualizerButton"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("clicks search button and navigates to search", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarSearchButton"));

      expect(mockNavigate).toHaveBeenCalledWith("/search");
    });

    it("clicks search button when in search and navigates to root", async () => {
      mockLocation = { pathname: "/search" };

      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarSearchButton"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("clicks share button", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarShareButton"));

      expect(dispatchToast).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Function),
      );
    });

    it("clicks settings button and navigates to settings", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarSettingsButton"));

      expect(mockNavigate).toHaveBeenCalledWith("/settings");
    });

    it("clicks settings button when in settings and navigates to root", async () => {
      mockLocation = { pathname: "/settings" };

      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarSettingsButton"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("presses Ctrl + Shift + F and navigates to search", async () => {
      render(<Titlebar />, state);

      const user = userEvent.setup();
      await user.keyboard("{Control>}{Shift>}F");

      expect(mockNavigate).toHaveBeenCalledWith("/search");
    });

    it("presses Ctrl + Shift + F when in search and navigates to root", async () => {
      mockLocation = { pathname: "/search" };

      render(<Titlebar />, state);

      const user = userEvent.setup();
      await user.keyboard("{Control>}{Shift>}F");

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("presses Ctrl + F and does not navigate to search", async () => {
      render(<Titlebar />, state);

      const user = userEvent.setup();
      await user.keyboard("{Tab}{Control>}F");

      expect(mockNavigate).not.toHaveBeenCalledWith("/search");
    });
  });

  describe("when electron version", () => {
    beforeAll(() => {
      import.meta.env.VITE_ENV = "electron";
    });

    it("renders Titlebar component", async () => {
      render(<Titlebar />, state);

      expect(screen.getByTestId("TitlebarLibraryButton")).toBeInTheDocument();
      expect(
        screen.getByTestId("TitlebarVisualizerButton"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarSearchButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarShareButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarSettingsButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarLocation")).toBeInTheDocument();

      expect(screen.getByTestId("TitlebarMinimizeButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarMaximizeButton")).toBeInTheDocument();
      expect(screen.getByTestId("TitlebarCloseButton")).toBeInTheDocument();
    });

    it("clicks minimize button and calls api", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarMinimizeButton"));

      expect(Api.minimizeWindow).toHaveBeenCalledOnce();
    });

    it("clicks maximize button and calls api with maximizes", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarMaximizeButton"));

      expect(Api.maximizeWindow).toHaveBeenCalledOnce();
    });

    it("clicks maximize button and calls api with unmaximize", async () => {
      vi.mocked(Api.isWindowMaximized).mockResolvedValueOnce(true);

      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarMaximizeButton"));

      expect(Api.unmaximizeWindow).toHaveBeenCalledOnce();
    });

    it("clicks close button and calls api", async () => {
      render(<Titlebar />, state);

      await userEvent.click(screen.getByTestId("TitlebarCloseButton"));

      expect(Api.closeWindow).toHaveBeenCalledOnce();
    });
  });
});
