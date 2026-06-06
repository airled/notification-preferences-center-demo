import { render, screen } from "@testing-library/react";
import { Region, User } from "@/models";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    const { prefetch, replace, scroll, ...rest } = props;
    return <a href={href} {...rest}>{children}</a>;
  },
}));

describe("User list page", () => {
  beforeEach(async () => {
    const region = await Region.create({
      name: "testregion",
      timezone: "America/New_York",
    });
    await User.create({
      email: "seeded@example.com",
      regionId: region!.id,
      startQuietHours: "22:00",
      endQuietHours: "08:00",
    });
  });

  it("renders user list", async () => {
    const Page = (await import("@/app/users/list/page")).default;
    render(await Page());

    const link = screen.getByRole("link", { name: /seeded@example.com/ });
    expect(link).toBeInTheDocument();
  });
});
