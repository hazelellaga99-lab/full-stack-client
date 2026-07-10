import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Post from "../pages/Post";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

describe("Post page", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renders post and comments and adds comment", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/posts/byId/"))
        return Promise.resolve({
          data: { id: 1, title: "P", postText: "B", username: "u1" },
        });
      if (url.includes("/comments/")) return Promise.resolve({ data: [] });
      if (url.includes("/auth/auth")) return Promise.resolve({ data: {} });
      return Promise.resolve({ data: {} });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{ authState: { status: false, username: "" } }}
        >
          <Post />
        </AuthContext.Provider>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("P")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write a comment..."),
    ).toBeInTheDocument();
  });
});
