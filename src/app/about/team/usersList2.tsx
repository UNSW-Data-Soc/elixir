import toast from "react-hot-toast";
import { Spinner, ZERO_WIDTH_SPACE } from "../../utils";
import { DirectorRole, ExecRole, directorRoles, execRoles } from "@/trpc/types";
import { api } from "@/trpc/server";
import Image from "next/image";
import { getUserProfilePicRoute } from "@/app/utils/s3";

const boardRoles = [...execRoles, ...directorRoles];
type BoardRole = ExecRole | DirectorRole;

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
  ];
  const currentYear = new Date().getFullYear();

  console.log(users);
  console.log(years);

  return (
    <div className="container relative">
      {years
        .sort((a, b) => b - a)
        .map((year) => (
          <label key={year} htmlFor={year.toString()}>
            {year}
          </label>
        ))}
      {years
        .sort((a, b) => b - a)
        .map((year) => (
          <div key={year}>
            <input
              type="radio"
              name="year"
              id={year.toString()}
              className="peer"
              defaultChecked={year === currentYear}
            />
            <div
              key={year}
              className="hidden flex-wrap justify-center gap-5 p-10 peer-checked:flex"
            >
              <h2>{year}</h2>
              {users
                .filter(({ userYearsActive }) => userYearsActive.year === year)
                .map(({ user, userYearsActive: yearsActive }) => (
                  <div
                    key={user.id}
                    className="flex flex-col items-center gap-3 rounded-2xl p-8 shadow-2xl"
                  >
                    <div className="relative aspect-square w-[200px] overflow-hidden rounded-full">
                      <Image
                        src={
                          user.image
                            ? getUserProfilePicRoute(user.id, user.image)
                            : "./logo.png"
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
                    <div>{user.email}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
