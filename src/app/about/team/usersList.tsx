import Image from "next/image";

import { Tooltip } from "@nextui-org/tooltip";

import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";
import { DirectorRole, ExecRole, directorRoles, execRoles } from "@/trpc/types";

import { LinkedInIcon } from "@/app/socialIcons";
import AvatarIcon from "@/app/utils/avatarIcon";
import { getUserProfilePicRoute } from "@/app/utils/s3";

import {
  EnvelopeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

import { Spinner, ZERO_WIDTH_SPACE } from "../../utils";

import toast from "react-hot-toast";

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
            <div className="hidden flex-wrap justify-center gap-5 py-16 peer-checked:flex">
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
      className="group flex flex-col items-center gap-2 rounded-2xl p-3 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl"
    >
      <div className="relative flex aspect-square w-[230px] items-center justify-start overflow-hidden rounded-2xl bg-[#eee]">
        {user.image ? (
          <Image
            src={getUserProfilePicRoute(user.id, user.image)}
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
          <p className="font-light">{yearsActive.role}</p>
        </div>
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
      </div>
    </div>
  );
}
