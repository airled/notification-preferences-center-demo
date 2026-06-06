import Link from "next/link";
import { User, Region } from "@/models";

export const dynamic = 'force-dynamic';

export default async function UsersList() {
  const users = await User.findAll({ include: Region });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans gap-2">
      {users.map(user => {
        return (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="bg-black text-white p-2 rounded"
          >
            {user.email} ({user.region.name}, {user.region.timezone})
          </Link>
        );
      })}

      <Link className="bg-gray-200 text-black p-2 rounded" href="/">
        Назад
      </Link>
    </div>
  );
}
