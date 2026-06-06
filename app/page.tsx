import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans gap-2">
      <Link href="/users/list" className="bg-black text-white p-2 rounded">
        Список пользователей
      </Link>
      <Link href="/users/create" className="bg-black text-white p-2 rounded">
        Создать пользователя
      </Link>
    </div>
  );
}
