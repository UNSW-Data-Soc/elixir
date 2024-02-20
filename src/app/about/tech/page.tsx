import { GitHubIcon } from "@/app/socialIcons";
import { DATASOC_GITHUB_LINK } from "@/app/utils";

const DATASOC_GITHUB = "https://github.com/unswdata";

type ProjectStatus =
  | "archived"
  | "active"
  | "planned"
  | "developing"
  | "unknown"
  | "beta";
type Project = {
  name: string;
  description: string;
  tech?: string[];
  languages?: string[];
  status: ProjectStatus;
};

const PROJECTS: Project[] = [
  {
    name: "Elixir",
    description: "our society's main website",
    tech: ["NextJS", "TailwindCSS", "DrizzleORM", "tRPC", "Auth.js"],
    languages: ["TypeScript"],
    status: "active",
  },
  {
    name: "Emailr",
    description: "an internal mass-emailing tool",
    tech: ["React", "TailwindCSS"],
    languages: ["TypeScript"],
    status: "beta",
  },
  {
    name: "Notifier",
    description: "an internal operations request tool",
    tech: ["Notion API", "Apps Script"],
    languages: ["JavaScript"],
    status: "beta",
  },
  {
    name: "Collectr",
    description: "our content-management system",
    tech: ["Notion API", "Apps Script"],
    languages: ["JavaScript"],
    status: "developing",
  },
  {
    name: "Connectr",
    description: "a platform for students to connect with each other",
    tech: ["React", "Express"],
    languages: ["JavaScript"],
    status: "planned",
  },
  {
    name: "excellr",
    description: "a resource hub for data courses",
    tech: ["NextJS?"],
    languages: ["JavaScript"],
    status: "planned",
  },
];

const FUTURE = [
  {
    name: "Headhuntr",
    description: "a jobs board for students",
  },
  {
    name: "Chattr",
    description: "a chat platform for students?",
  },
  {
    name: "Bridgr",
    description: "a platform to connect students with industry professionals",
  },
];

export default function Page() {
  return (
    <main className="flex-grow pb-10">
      <header className=" flex w-full flex-col items-center justify-center gap-6 bg-purple-200 p-10 text-center text-purple-900 shadow-md">
        <p className="text-4xl">
          DataSoc&apos;s <span className="font-semibold">Tech</span>!
        </p>
        <div className="flex flex-col items-center gap-6">
          <p className="max-w-2xl leading-7">
            Check out our tech stacks and how we build our projects. We build
            both <span className="font-semibold">external applications</span> to
            serve our members and{" "}
            <span className="font-semibold">internal tools</span> to help us
            manage and automate the society&apos;s operations.
          </p>
          <a
            href={DATASOC_GITHUB}
            className="flex flex-row gap-2 rounded-xl bg-purple-300 p-4 py-2 transition-colors hover:bg-purple-400"
            target="_blank"
          >
            <GitHubIcon width={25} height={25} />
            IT Github
          </a>
          {/* <a href={TODO} className="block rounded-xl bg-blue-300 p-4 py-2">Edu Github</a> */}
        </div>
      </header>
      <Projects />
    </main>
  );
}

function Projects() {
  return (
    <div className="mx-auto flex max-w-7xl flex-row flex-wrap justify-center gap-5 p-10">
      {PROJECTS.map((project, index) => (
        <div
          key={index}
          className={`relative flex flex-col gap-2 rounded-xl ${statusToColour100(
            project.status,
          )} p-8 shadow-md`}
        >
          <p
            className={`absolute right-3 top-3 rounded-lg ${statusToColour200(
              project.status,
            )} ${statusToColourBorder300(project.status)} border-2 px-2 py-1`}
          >
            {project.status}
          </p>
          <h2 className="text-2xl font-semibold lowercase">{project.name}</h2>
          <p className="lowercase">{project.description}</p>
          {!!project.tech && (
            <div className="flex flex-row flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <p
                  key={index}
                  className={`rounded-lg ${statusToColour200(
                    project.status,
                  )} px-2 py-1 text-sm`}
                >
                  {tech}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const statusToColour100 = (status: ProjectStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100";
    case "planned":
      return "bg-blue-100";
    case "developing":
      return "bg-orange-100";
    case "beta":
      return "bg-red-100";
    case "archived":
      return "bg-gray-100";
    default:
      return "bg-gray-100";
  }
};

const statusToColour200 = (status: ProjectStatus) => {
  switch (status) {
    case "active":
      return "bg-green-200";
    case "planned":
      return "bg-blue-200";
    case "developing":
      return "bg-orange-200";
    case "beta":
      return "bg-red-200";
    case "archived":
      return "bg-gray-200";
    default:
      return "bg-gray-200";
  }
};

const statusToColourBorder300 = (status: ProjectStatus) => {
  switch (status) {
    case "active":
      return "border-green-300";
    case "planned":
      return "border-blue-300";
    case "developing":
      return "border-orange-300";
    case "beta":
      return "border-red-300";
    case "archived":
      return "border-gray-300";
    default:
      return "border-gray-300";
  }
};
