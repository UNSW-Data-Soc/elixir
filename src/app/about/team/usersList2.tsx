import toast from "react-hot-toast";
import { Spinner, ZERO_WIDTH_SPACE } from "../../utils";
import { DirectorRole, ExecRole, directorRoles, execRoles } from "@/trpc/types";
import { api } from "@/trpc/server";
import Image from "next/image";
import { getUserProfilePicRoute } from "@/app/utils/s3";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { LinkedInIcon } from "@/app/socialIcons";
import { RouterOutputs } from "@/trpc/shared";

type User = RouterOutputs["users"]["getTeam"][number];
const boardRoles = [...execRoles, ...directorRoles];

const EMPTY_ABOUT_MESSAGE = "This profile remains a mystery...";

const portfolioOrder = boardRoles.reduce(
  (acc: { [key: string]: number }, role, idx) => {
    acc[role] = idx;
    return acc;
  },
  {},
);

function roleToOrder(role: string): number {
  if (role in portfolioOrder) return portfolioOrder[role];
  return Infinity;
}

export default async function UsersList() {
  const users = (await api.users.getTeam.query()).sort(
    (a, b) =>
      roleToOrder(a.userYearsActive.role) - roleToOrder(b.userYearsActive.role),
  );

  const years = [
    ...new Set<number>(users.map((user) => user.userYearsActive.year)),
  ].sort((a, b) => b - a);
  const currentYear = new Date().getFullYear();

  console.log(years);

  return (
    <div className="container relative">
      {years.map(
        (
          year,
          yearIdx, // essentially implementing no-JS tabs
        ) => (
          <div key={year}>
            <input
              type="radio"
              name="year"
              id={year.toString()}
              className="peer hidden"
              defaultChecked={year === currentYear}
            />
            <label
              htmlFor={year.toString()}
              className="absolute top-0 cursor-pointer rounded-xl border p-3 px-5 transition-all peer-checked:bg-[#333] peer-checked:text-white"
              style={{ left: `${yearIdx * 6}rem` }}
            >
              {year}
            </label>
            <div className="hidden flex-wrap justify-center gap-5 p-10 peer-checked:flex">
              {users
                .filter(({ userYearsActive }) => userYearsActive.year === year)
                .map((user) => (
                  <UserCard user={user} key={user.user.id} />
                ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function UserCard({
  user: { user, userYearsActive: yearsActive },
}: {
  user: User;
}) {
  return (
    <div
      key={user.id}
      className="flex flex-col items-center gap-2 rounded-2xl p-8 shadow-2xl"
    >
      <div className="relative aspect-square w-[200px] overflow-hidden rounded-2xl">
        <Image
          src={
            user.image
              ? getUserProfilePicRoute(user.id, user.image)
              : "/logo.png" // TODO: default profile picture
          }
          fill={true}
          className="object-cover"
          alt="Team Member Portrait"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h4 className="text-large font-bold">{user.name}</h4>
        <p className="font-light">{yearsActive.role}</p>
      </div>
      <div className="flex flex-row gap-2">
        <a href={`mailto:${user.email}`}>
          <EnvelopeIcon height={20} />
        </a>
        <a>
          <LinkedInIcon height={20} width={20} colour={false} />
        </a>
      </div>
    </div>
  );
}
