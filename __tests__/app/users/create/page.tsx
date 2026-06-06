import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    const { prefetch, replace, scroll, ...rest } = props;
    return <a href={href} {...rest}>{children}</a>;
  },
}));

describe("Create user list page", () => {
  it("renders user create page", async () => {
    const Page = (await import("@/app/users/create/page")).default;
    render(await Page());

    const link = screen.getByRole("button", { name: /Создать/ });
    expect(link).toBeInTheDocument();
  });
});
