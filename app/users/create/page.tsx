import { Region } from "@/models";
import { createUser } from "@/services/createUser";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CreateUser() {
  const regions = await Region.findAll();
  const hours = [...Array(24).keys()];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans gap-2">
      <form action={createUser} className="grid grid-cols-1 gap-2">
        <select className="border border-black p-2" name="startQuietHours">
          {hours.map(hour => {
            return (
              <option key={`startHour${hour}`} value={`${hour}:00`}>
                {`${hour}:00`}
              </option>
            );
          })}
        </select>

        <select className="border border-black p-2" name="endQuietHours">
          {hours.map(hour => {
            return (
              <option key={`endHour${hour}`} value={`${hour}:00`}>
                {`${hour}:00`}
              </option>
            );
          })}
        </select>

        <select className="border border-black p-2" name="regionId">
          {regions.map(region => {
            return (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            );
          })}
        </select>

        <input
          type="text"
          name="email"
          placeholder="email"
          className="border border-black p-2"
        />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Создать
        </button>
      </form>
      <Link className="bg-gray-200 text-black p-2 rounded" href="/">
        Назад
      </Link>
    </div>
  );
}
