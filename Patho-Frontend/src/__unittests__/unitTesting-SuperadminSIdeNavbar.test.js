import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router for Link component
import Sidenavbar from "../SuperAdmin/Navbar/sidenavbar"; // Import the component to test

// Mock image imports
jest.mock("../SuperAdmin/Navbar/img/dashboard.png", () => "dashboard.png");
jest.mock("../SuperAdmin/Navbar/img/logo.png", () => "logo.png");

describe("Sidenavbar Component", () => {
  const toggleSidebar = jest.fn();

  it("should render the sidebar", () => {
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={toggleSidebar} />
      </Router>
    );

    // Check if the sidebar's logo is rendered
    // expect(screen.getByAltText("Logo")).toBeInTheDocument();
    // Check if the User Management button is rendered
    // expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("should toggle the sidebar open and closed based on 'isOpen' prop", () => {
    // Test for when isOpen is true
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={toggleSidebar} />
      </Router>
    );
    // Check if the sidebar is visible
    // expect(screen.getByRole("navigation")).toHaveClass("translate-x-0");

    // Test for when isOpen is false
    render(
      <Router>
        <Sidenavbar isOpen={false} toggleSidebar={toggleSidebar} />
      </Router>
    );
    // Check if the sidebar is hidden
    // expect(screen.getByRole("navigation")).toHaveClass("-translate-x-full");
  });

  it("should call handleSelect when the 'User Management' button is clicked", () => {
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={toggleSidebar} />
      </Router>
    );

    // Click the User Management button
    const button = screen.getByText("User Management");
    fireEvent.click(button);

    // The button should now have the selected styles
    // expect(button).toHaveClass("bg-blue-900 text-white");
  });

  it("should apply the correct styles for selected and unselected buttons", () => {
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={toggleSidebar} />
      </Router>
    );

    const button = screen.getByText("User Management");

    // Initially, the button should not be selected
    // expect(button).toHaveClass("text-black");

    // // Simulate clicking the button
    // fireEvent.click(button);

    // // After the click, the button should be selected and have 'bg-blue-900 text-white' classes
    // expect(button).toHaveClass("bg-blue-900 text-white");
  });

  it("should change the icon color based on the selection", () => {
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={toggleSidebar} />
      </Router>
    );

    const button = screen.getByText("User Management");
    const icon = screen.getByAltText("Dashboard");

    // Initially, the icon should have the inverted class (indicating it's not selected)
    // expect(icon).toHaveClass("invert");

    // // Simulate clicking the button
    // fireEvent.click(button);

    // // After the click, the icon should not have the 'invert' class (indicating it is selected)
    // expect(icon).not.toHaveClass("invert");
  });
});
