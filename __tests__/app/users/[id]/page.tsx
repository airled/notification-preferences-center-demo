import { render, screen } from "@testing-library/react";
import { User, Region } from "@/models";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    const { prefetch, replace, scroll, ...rest } = props;
    return <a href={href} {...rest}>{children}</a>;
  },
}));

let userId: number;

describe("User page", () => {
  beforeEach(async () => {
    const region = await Region.create({
      name: "testregion",
      timezone: "America/New_York",
    });
    const user = await User.create({
      email: "seeded@example.com",
      regionId: region!.id,
      startQuietHours: "22:00",
      endQuietHours: "08:00",
    });
    userId = user.id;
  });

  it("renders user info", async () => {
    const Page = (await import("@/app/users/[id]/page")).default;
    render(await Page({ params: Promise.resolve({ id: String(userId) }) }));

    const text = screen.getByText(/seeded@example.com/);
    expect(text).toBeInTheDocument();
  });
});
