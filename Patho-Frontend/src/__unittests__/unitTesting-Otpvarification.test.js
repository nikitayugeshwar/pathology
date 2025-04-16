import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Otpvarification from "../Otpvarification/Otpvarification";

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert
});

afterEach(() => {
  jest.restoreAllMocks(); // Restore mocks
});

describe("Otpvarification Component", () => {
  test("renders the OTP verification component", () => {
    render(
      <BrowserRouter>
        <Otpvarification />
      </BrowserRouter>
    );
    // expect(screen.getByText("OTP Verification")).toBeInTheDocument();
  });

  test("renders 6 OTP input fields empty by default", () => {
    render(
      <BrowserRouter>
        <Otpvarification />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(6);
    inputs.forEach((input) => expect(input.value).toBe(""));
  });

  test("updates OTP fields on typing", () => {
    render(
      <BrowserRouter>
        <Otpvarification />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(inputs[0].value).toBe("1");
  });

  test("focus moves to the next field after typing", () => {
    render(
      <BrowserRouter>
        <Otpvarification />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(document.activeElement).toBe(inputs[1]);
  });

  test("does not allow non-numeric values", () => {
    render(
      <BrowserRouter>
        <Otpvarification />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "a" } });
    expect(inputs[0].value).toBe("");
  });

  test("resets inputs and timer on resend OTP", () => {
    render(
      <BrowserRouter>
        <Otpvarification />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    // expect(inputs[0].value).toBe("1");

    const resendLink = screen.getByText("Resend");
    fireEvent.click(resendLink);

    inputs.forEach((input) => expect(input.value).toBe(""));
    // expect(screen.getByText("00:20")).toBeInTheDocument();
  });

  // test("timer counts down correctly", () => {
  //   jest.useFakeTimers(); // Mock timers
  //   render(
  //     <BrowserRouter>
  //       <Otpvarification />
  //     </BrowserRouter>
  //   );
  //   expect(screen.getByText("00:20")).toBeInTheDocument();
  //   jest.advanceTimersByTime(1000);
  //   expect(screen.getByText("00:19")).toBeInTheDocument();
  //   jest.useRealTimers();
  // });

  // test("displays entered OTP on submit", () => {
  //   render(
  //     <BrowserRouter>
  //       <Otpvarification />
  //     </BrowserRouter>
  //   );
  //   const inputs = screen.getAllByRole("textbox");
  //   inputs.forEach((input, idx) =>
  //     fireEvent.change(input, { target: { value: String(idx + 1) } })
  //   );

  //   const submitButton = screen.getByText("Continue");
  //   fireEvent.click(submitButton);

  //   expect(window.alert).toHaveBeenCalledWith("OTP entered: 123456");
  // });

  // test("timer stops at 0", () => {
  //   jest.useFakeTimers();
  //   render(
  //     <BrowserRouter>
  //       <Otpvarification />
  //     </BrowserRouter>
  //   );
  //   jest.advanceTimersByTime(21000); // Move past 20 seconds
  //   expect(screen.getByText("00:00")).toBeInTheDocument();
  //   jest.useRealTimers();
  // });

  // test("resend works after timer ends", () => {
  //   jest.useFakeTimers();
  //   render(
  //     <BrowserRouter>
  //       <Otpvarification />
  //     </BrowserRouter>
  //   );

  //   jest.advanceTimersByTime(21000); // Move past 20 seconds
  //   expect(screen.getByText("00:00")).toBeInTheDocument();

  //   const resendLink = screen.getByText("Resend");
  //   fireEvent.click(resendLink);

  //   expect(screen.getByText("00:20")).toBeInTheDocument();
  //   jest.useRealTimers();
  // });
});
