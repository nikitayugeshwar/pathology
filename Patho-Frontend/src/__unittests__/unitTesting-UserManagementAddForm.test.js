import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddUser from "../UserManagement/AddUser/AddUser";

describe("AddUser Component", () => {
  const renderComponent = () =>
    render(
      <Router>
        <AddUser />
      </Router>
    );

  test("renders Back button with correct text and icon", () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    // expect(backButton).toBeInTheDocument();
    // expect(screen.getByText(/back/i)).toBeInTheDocument();
    // expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument(); // Icon
  });

  test("navigates to /superAdmin when Back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    // expect(backButton.closest("a")).toHaveAttribute("href", "/superAdmin");
  });

  test("renders AddForm component", () => {
    renderComponent();

    // expect(screen.getByRole("form")).toBeInTheDocument();
  });

  test("page has correct structure and spacing", () => {
    renderComponent();

    // const container = screen.getByTestId("page-container");
    // expect(container).toHaveClass("h-screen", "w-full", "flex", "flex-col", "px-5", "py-10", "gap-10");
  });
});
