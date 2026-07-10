import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "../pages/Home";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  MemoryRouter: ({ children }) => children,
  useNavigate: () => jest.fn(),
}));

jest.mock("axios");

const postsResponse = {
  data: {
    listOfPosts: [
      {
        id: 1,
        title: "T1",
        postText: "Body",
        Likes: [],
        UserId: 1,
        username: "u1",
      },
    ],
    likedPosts: [],
  },
};

describe("Home page", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.resetAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes("/posts")) return Promise.resolve(postsResponse);
      if (url.includes("/auth/auth")) return Promise.resolve({ data: {} });
      return Promise.resolve({ data: {} });
    });
  });

  test("renders posts and likes a post", async () => {
    axios.post.mockResolvedValue({ data: { liked: true } });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // wait for post title to appear
    expect(await screen.findByText("T1")).toBeInTheDocument();

    // initial likes label is 0
    expect(screen.getByText("0")).toBeInTheDocument();

    // click like button via test id (avoid direct DOM access)
    const likeEl = screen.getByTestId("like-button-1");
    expect(likeEl).toBeTruthy();
    fireEvent.click(likeEl);

    // wait for optimistic update via queryClient
    await screen.findByText("1");
  });
});
