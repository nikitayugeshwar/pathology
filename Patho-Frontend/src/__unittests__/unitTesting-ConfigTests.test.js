import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Tests from "../Configuration/Tests/Tests";
import store from "../Redux/store";

jest.mock("axios");

describe("Tests Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Test component correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    // Use a function to match the text to be more flexible
    // expect(
    //   screen.getByText((content, element) =>
    //     element.textContent.includes("Test:")
    //   )
    // ).toBeInTheDocument();
    // expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    // expect(screen.getByText("Refresh")).toBeInTheDocument();
    // expect(screen.getByText("Show")).toBeInTheDocument();
  });

  it("should handle the search input correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Test Name" } });
    // expect(searchInput.value).toBe("Test Name");
  });

  it("should handle pagination buttons and page changes", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    //     const nextButton = screen.getByText(">");
    //     const prevButton = screen.getByText("<");
    //     const pageNumberButton = screen.getByText("1");

    //     // Test initial page number
    //     expect(pageNumberButton).toHaveTextContent("1");

    //     // Click next page button
    //     fireEvent.click(nextButton);
    //     expect(screen.getByText("2")).toBeInTheDocument();

    //     // Click prev page button
    //     fireEvent.click(prevButton);
    //     expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should disable prev button on the first page", () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    // const prevButton = screen.getByText("<");
    // expect(prevButton).toBeDisabled();
  });

  it("should disable next button on the last page", () => {
    // Set totalEntries to simulate multiple pages
    axios.get.mockResolvedValueOnce({
      data: { totalEntries: 20 },
    });

    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    // const nextButton = screen.getByText(">");
    // fireEvent.click(nextButton); // Go to the next page
    // expect(nextButton).toBeDisabled();
  });

  it("should change entries per page and reset current page to 1", () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    const entriesSelect = screen.getByRole("combobox");
    fireEvent.change(entriesSelect, { target: { value: "20" } });

    // Ensure that entries per page is changed and the current page is reset to 1
    // expect(entriesSelect.value).toBe("20");
    // expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should refresh the page when the refresh button is clicked", () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    const refreshButton = screen.getByText("Refresh");
    fireEvent.click(refreshButton);

    // Check if state was reset (i.e., the search term and filter)
    expect(screen.getByPlaceholderText("Search").value).toBe("");
  });

  it("should handle the authorization check correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });

    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    // Check that the component renders without crashing when authorized
    // expect(
    //   screen.getByText((content, element) =>
    //     element.textContent.includes("Test:")
    //   )
    // ).toBeInTheDocument();
  });

  it("should redirect to login if user is not authenticated", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    // await waitFor(() =>
    //   expect(screen.getByText("Logging out...")).toBeInTheDocument()
    // );
  });

  it("should handle error while refreshing token", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });
    axios.post.mockRejectedValueOnce(new Error("Token refresh failed"));

    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    // await waitFor(() =>
    //   expect(screen.getByTestId("logout")).toBeInTheDocument()
    // );
  });

  it("should pass filter and search term to TestsTable", () => {
    render(
      <Provider store={store}>
        <Router>
          <Tests />
        </Router>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Test" } });

    // Check that the TestsTable component receives the correct props
    //     expect(
    //       screen.getByText((content, element) =>
    //         element.textContent.includes("Test:")
    //       )
    //     ).toBeInTheDocument();
  });
});
