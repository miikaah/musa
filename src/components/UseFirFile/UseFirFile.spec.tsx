import React from "react";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UseFirFile from "./UseFirFile";
import { render } from "../../../test/render";
import { firFiles } from "../../reducers/settings.reducer";

const name = "Bose QuietComfort 45 44.1 kHz";
const filename = "bose_quietcomfort_45_44100Hz.wav";

const state = {
  settings: {
    isInit: true,
    firFile: "",
    firFiles,
  },
};

const state2 = {
  ...state,
  settings: {
    ...state.settings,
    isInit: false,
  },
};

const state3 = {
  ...state,
  settings: {
    ...state.settings,
    firFile: filename,
  },
};

describe("UseFirFile", () => {
  it("renders UseFirFile component", async () => {
    render(<UseFirFile name={name} filename={filename} />, state);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByLabelText(name)).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders null when not isInit", async () => {
    render(<UseFirFile name={name} filename={filename} />, state2);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(name)).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("toggles fir file and make up gain disabled", async () => {
    render(<UseFirFile name={name} filename={filename} />, state);

    expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(false);
    expect(screen.getByRole<HTMLInputElement>("spinbutton").disabled).toBe(
      true,
    );

    await userEvent.click(screen.getByRole("checkbox"));

    act(() => {
      expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(true);
      expect(screen.getByRole<HTMLInputElement>("spinbutton").disabled).toBe(
        false,
      );
    });
  });

  it("updates make up gain", async () => {
    render(<UseFirFile name={name} filename={filename} />, state3);

    expect(screen.getByRole<HTMLInputElement>("spinbutton")).toHaveValue(0);

    await userEvent.type(screen.getByRole("spinbutton"), "5");

    act(() => {
      expect(screen.getByRole<HTMLInputElement>("spinbutton")).toHaveValue(5);
    });
  });
});
