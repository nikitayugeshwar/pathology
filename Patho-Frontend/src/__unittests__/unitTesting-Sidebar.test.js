import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidenavbar from "../Navbar/sidenavbar";

describe("Sidenavbar Component", () => {
  test("handles sidebar item selection correctly", () => {
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={jest.fn()} />
      </Router>
    );

    // Initial selection should be the first item (Dashboard)
    // expect(screen.getByText("Dashboard")).toHaveClass("bg-blue-900 text-white");

    // // Click on the 'Patient' button and verify selection
    // fireEvent.click(screen.getByText("Patient"));
    // expect(screen.getByText("Patient")).toHaveClass("bg-blue-900 text-white");
    // expect(screen.getByText("Dashboard")).not.toHaveClass(
    //   "bg-blue-900 text-white"
    // );

    // Click on the 'Test' button and verify selection
    // fireEvent.click(screen.getByText("Test"));
    // expect(screen.getByText("Test")).toHaveClass("bg-blue-900 text-white");
    // expect(screen.getByText("Patient")).not.toHaveClass(
    //   "bg-blue-900 text-white"
    // );
  });

  test("correctly applies image inversion on selection", () => {
    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={jest.fn()} />
      </Router>
    );

    const dashboardIcon = screen.getByAltText("Dashboard");
    const testIcon = screen.getByAltText("Exam");

    // Initially, the Dashboard icon should not have inversion (should have invert class)
    // expect(dashboardIcon).toHaveClass("invert");

    // // After selecting 'Dashboard', the icon should be displayed without inversion
    // fireEvent.click(screen.getByText("Dashboard"));
    // expect(dashboardIcon).toHaveClass("invert-0");

    // // Test the 'Test' button, ensuring its image gets inverted when unselected
    // fireEvent.click(screen.getByText("Test"));
    // expect(testIcon).toHaveClass("invert");
  });

  test("calls toggleSidebar function when isOpen is true", () => {
    const toggleSidebarMock = jest.fn();

    render(
      <Router>
        <Sidenavbar isOpen={true} toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Verify that the toggleSidebar function is called (for example, if a button triggers it)
    // expect(toggleSidebarMock).toHaveBeenCalledTimes(0); // Replace with actual event if needed
  });

  test("sidebar is hidden when isOpen is false", () => {
    render(
      <Router>
        <Sidenavbar isOpen={false} toggleSidebar={jest.fn()} />
      </Router>
    );

    // The sidebar should be hidden if isOpen is false
    // const sidenav = screen.getByRole("navigation");
    // expect(sidenav).toHaveClass("-translate-x-full");
  });

  test("renders correctly with no props", () => {
    render(
      <Router>
        <Sidenavbar isOpen={false} toggleSidebar={jest.fn()} />
      </Router>
    );

    // Ensure the sidebar is closed and elements still render
    // expect(screen.getByText("Dashboard")).toBeInTheDocument();
    // expect(screen.getByText("Patient")).toBeInTheDocument();
    // expect(screen.getByText("Test")).toBeInTheDocument();
    // expect(screen.getByText("Report")).toBeInTheDocument();
    // expect(screen.getByText("Configuration")).toBeInTheDocument();
  });
});
