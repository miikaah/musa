import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";
import { translate } from "../../i18n";
import { render } from "../../../test/render";

const mockCloseModal = vi.fn();

const t = translate("en");
const mockText = "mock";
const closeButtonText = String(t("modal.closeButton"));

const state = {
  settings: { t },
};

describe("Modal", () => {
  it("renders Modal component", async () => {
    render(
      <Modal closeModal={mockCloseModal} maxWidth={420}>
        <p>{mockText}</p>
      </Modal>,
      state,
    );

    expect(screen.getByText(mockText)).toBeInTheDocument();
    expect(screen.getByText(closeButtonText)).toBeInTheDocument();
  });

  it("calls closeModal click handler", async () => {
    render(
      <Modal closeModal={mockCloseModal} maxWidth={420}>
        <p>{mockText}</p>
      </Modal>,
      state,
    );

    await userEvent.click(screen.getByText(closeButtonText));

    expect(mockCloseModal).toHaveBeenCalledOnce();
  });
});
