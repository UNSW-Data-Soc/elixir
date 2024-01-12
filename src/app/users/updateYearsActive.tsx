"use client";

import React, { useState } from "react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import {
  DirectorRole,
  ExecRole,
  SubcomRole,
  UserRoleGroup,
  directorRoles,
  execRoles,
  subcomRoles,
} from "@/trpc/types";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

type User = RouterOutputs["users"]["getAll"][number];
type SocietyRole = ExecRole | DirectorRole | SubcomRole;

const UNSELECTED_ROLE = "__DEFAULT__";

export default function UpdateYearsActive({ user }: { user: User }) {
  const ctx = api.useUtils();

  const [year, setYear] = useState<string>("");
  const [societyRole, setSocietyRole] = useState<
    SocietyRole | typeof UNSELECTED_ROLE
  >(UNSELECTED_ROLE);

  const {
    data: yearsActive,
    isLoading,
    isError,
  } = api.users.yearsActive.getByUser.useQuery({
    id: user.id,
  });

  const { mutate: addYearActive, isLoading: addingYearActive } =
    api.users.yearsActive.add.useMutation({
      onSuccess: () => {
        toast.success("Added year active");
        setYear("");
        setSocietyRole(UNSELECTED_ROLE);
        void ctx.users.yearsActive.getByUser.invalidate({ id: user.id });
      },
      onError: (e) => {
        toast.error(`Failed to add year active: ${e.message}`);
      },
    });

  const { mutate: deleteYearActive } = api.users.yearsActive.delete.useMutation(
    {
      onSuccess: () => {
        toast.success("Deleted year active");
        void ctx.users.yearsActive.getByUser.invalidate({ id: user.id });
      },
      onError: (e) => {
        toast.error(`Failed to delete year active: ${e.message}`);
      },
    },
  );

  if (isLoading)
    // TODO: better loading state
    return (
      <>
        <p className="py-5 text-2xl font-semibold">Years active</p>
        <div>Loading...</div>
      </>
    );
  if (isError) return <></>;

  const addYearSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidYear(year)) {
      toast.error("Please enter a valid year");
      return;
    } else if (yearsActive.map(({ year }) => year).indexOf(+year) !== -1) {
      toast.error("Year already exists");
      return;
    } else if (societyRole === UNSELECTED_ROLE) {
      toast.error("Please select a role");
      return;
    }

    addYearActive({
      id: user.id,
      year: +year,
      role: societyRole ?? "n/a",
      group: roleToGroup(societyRole ?? "n/a"),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-2xl font-semibold">Years active</p>
      {!!yearsActive &&
        yearsActive.map(({ year, role }) => (
          <div key={year} className="flex flex-row justify-between py-2 pl-2">
            <p>{year}</p>
            <p>{role}</p>
            <button onClick={() => deleteYearActive({ id: user.id, year })}>
              <TrashIcon height={20} color="red" />
            </button>
          </div>
        ))}
      <form className="flex flex-row gap-2" onSubmit={addYearSubmit}>
        <input
          type="text"
          placeholder="year"
          className="flex-grow-1 min-w-0 rounded-xl bg-[#fafafa] px-3 py-2 outline-none transition-all focus:bg-[#eee] focus:outline-none"
          disabled={addingYearActive}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <select
          className="flex-grow-1 rounded-xl bg-[#fafafa] px-3 py-2 outline-none transition-all focus:bg-[#eee] focus:outline-none"
          value={societyRole}
          onChange={(e) => setSocietyRole(e.target.value as SocietyRole)}
        >
          <option disabled value={UNSELECTED_ROLE}>
            -- select a role --
          </option>
          {[...execRoles, ...directorRoles, ...subcomRoles].map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button type="submit" className="">
          <PlusIcon height={20} color="#000" />
        </button>
      </form>
    </div>
  );
}

function isValidYear(year: string): boolean {
  return !isNaN(+year) && +year >= 1000 && +year <= 9999;
}

function roleToGroup(societyRole: string): UserRoleGroup {
  if (execRoles.includes(societyRole as ExecRole)) {
    return "exec";
  } else if (directorRoles.includes(societyRole as DirectorRole)) {
    return "director";
  } else if (subcomRoles.includes(societyRole as SubcomRole)) {
    return "subcom";
  } else {
    throw new Error("Invalid role");
  }
}
