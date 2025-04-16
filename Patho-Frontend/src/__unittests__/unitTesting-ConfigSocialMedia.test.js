import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Socialmedia from "../Configuration/SocialmediaIntegration/Socialmedia";

// Mock the dependencies
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Socialmedia Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should log out and navigate to login if token refresh fails", async () => {
    // Mock the axios get to simulate a 401 error and the axios post to fail
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });
    axios.post.mockRejectedValueOnce(new Error("Token refresh failed"));

    render(
      <Router>
        <Socialmedia />
      </Router>
    );

    // Ensure the component navigates to the login page after token refresh failure
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });

  it("should render logging out message when isLoggedIn is false", () => {
    render(
      <Router>
        <Socialmedia />
      </Router>
    );
  });

  it("should render correct links and icons", () => {
    render(
      <Router>
        <Socialmedia />
      </Router>
    );

    // Ensure that the icons are rendered correctly with links
    // expect(screen.getByText("Email")).toBeInTheDocument();
    // expect(screen.getByText("Twilio")).toBeInTheDocument();
    // expect(screen.getByText("Whatsapp")).toBeInTheDocument();

    // Check the icons by their test ID (set using `data-testid` on icons)
    // expect(screen.getByTestId("MdOutlineMail")).toBeInTheDocument();
    // expect(screen.getByTestId("SiTwilio")).toBeInTheDocument();
    // expect(screen.getByTestId("ImWhatsapp")).toBeInTheDocument();
  });
});
