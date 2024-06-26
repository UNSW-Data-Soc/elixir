import Image from "next/image";

import { Tooltip } from "@nextui-org/tooltip";

import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";
import { directorRoles, execRoles } from "@/trpc/types";

import AvatarIcon from "@/app/utils/avatarIcon";
import { getUserProfilePicRoute } from "@/app/utils/s3";

import {
  EnvelopeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type User = RouterOutputs["users"]["getTeam"][number];
const boardRoles = [...execRoles, ...directorRoles];

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
            <div className="hidden flex-wrap justify-center gap-5 py-16 pt-24 peer-checked:flex">
              {users
                .filter(({ userYearsActive }) => userYearsActive.year === year)
                .map((user) => (
                  <UserCard user={user} key={user.users.id} />
                ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function UserCard({
  user: { users: user, userYearsActive: yearsActive },
}: {
  user: User;
}) {
  return (
    <div
      key={user.id}
      className="group flex flex-col items-center gap-2 rounded-2xl border p-3 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl"
    >
      <div className="relative flex aspect-square w-[230px] items-center justify-start overflow-hidden rounded-2xl bg-[#eee]">
        {yearsActive.photo || user.image ? (
          <Image
            src={getUserProfilePicRoute(
              user.id,
              (yearsActive.photo ?? user.image) as string, // TODO: typescript doesn't realise that this is ok
            )}
            fill={true}
            className="object-cover"
            alt="Team Member Portrait"
          />
        ) : (
          <AvatarIcon />
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-2 px-3 py-2">
        <div className="flex flex-col items-center gap-1">
          <h4 className="text-lg font-semibold">{user.name}</h4>
          <p className="text-sm font-light">{yearsActive.role}</p>
        </div>
        {/* <UserInfo user={user} /> */}
      </div>
    </div>
  );
}

function UserInfo({ user }: { user: User["users"] }) {
  return (
    <div className="flex flex-row gap-2">
      {/* <Tooltip content={<p>{user.email}</p>} placement="bottom"> */}
      <a href={`mailto:${user.email}`}>
        <EnvelopeIcon height={20} />
      </a>
      {/* </Tooltip> */}
      {/* <a href={`https://www.linkedin.com/in/${user.linkedin}/`}>
    <LinkedInIcon height={20} width={20} colour={false} />
  </a> */}
      {!!user.about && user.about.length > 0 && (
        <Tooltip content={<p>{user.about}</p>} placement="bottom">
          <InformationCircleIcon height={20} />
        </Tooltip>
      )}
    </div>
  );
}
