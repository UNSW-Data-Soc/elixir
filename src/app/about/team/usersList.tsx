import toast from "react-hot-toast";
import { Spinner, ZERO_WIDTH_SPACE } from "../../utils";
import { DirectorRole, ExecRole, directorRoles, execRoles } from "@/trpc/types";
import { api } from "@/trpc/server";
import Image from "next/image";
import { getUserProfilePicRoute } from "@/app/utils/s3";
import {
  EnvelopeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { LinkedInIcon } from "@/app/socialIcons";
import { RouterOutputs } from "@/trpc/shared";
import { Tooltip } from "@nextui-org/tooltip";

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
          <Tooltip content={<p>{user.about}</p>} placement="bottom">
            <InformationCircleIcon height={20} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function AvatarIcon({ height = 90 }: { height?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={`${height}%`}
      role="presentation"
      viewBox="0 0 24 24"
      width={`${height}%`}
      className="m-auto"
    >
      <path
        d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
        fill="currentColor"
      ></path>
      <path
        d="M17.0809 14.1489C14.2909 12.2889 9.74094 12.2889 6.93094 14.1489C5.66094 14.9989 4.96094 16.1489 4.96094 17.3789C4.96094 18.6089 5.66094 19.7489 6.92094 20.5889C8.32094 21.5289 10.1609 21.9989 12.0009 21.9989C13.8409 21.9989 15.6809 21.5289 17.0809 20.5889C18.3409 19.7389 19.0409 18.5989 19.0409 17.3589C19.0309 16.1289 18.3409 14.9889 17.0809 14.1489Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
