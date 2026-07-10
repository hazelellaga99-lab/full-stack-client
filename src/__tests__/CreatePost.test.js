import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreatePost from "../pages/CreatePost";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  MemoryRouter: ({ children }) => children,
  useNavigate: () => jest.fn(),
}));

jest.mock("axios");

describe("CreatePost page", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.resetAllMocks();
    axios.get.mockResolvedValue({ data: {} }); // auth check
    axios.post.mockResolvedValue({ data: {} });
  });

  test("submits the create post form", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreatePost />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const titleInput = screen.getByPlaceholderText("Title");
    const postInput = screen.getByPlaceholderText("Post Text");

    await userEvent.type(titleInput, "My title");
    await userEvent.type(postInput, "Hello world");

    // submit the Formik form by clicking the submit button (preferred)
    const submitButton = screen.getByRole("button", { name: /create post/i });
    expect(submitButton).toBeTruthy();
    await userEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/posts",
      { title: "My title", postText: "Hello world" },
      { withCredentials: true },
    );
  });
});
