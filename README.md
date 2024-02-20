## Overview

This project uses

- [Next.js](https://nextjs.org/learn)
- [Tailwind CSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)
- [Auth.js](https://authjs.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)

## Setting Up

Once you have cloned the repository locally, run

```bash
npm install
```

to download all necessary packages.

---

If it is your first time setting up, create a `.env` file in the root directory
and copy-paste the `.env.example` file's contents into `.env`

Ask the IT directors to give you the values for the environment variables. NEVER commit or push the `.env` file.

---

Ensure that you have Prettier (VSCode extension or other) installed to lint your code before you commit + push.

## Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

For faster compilation times (but possibly buggy behaviour), you can use:

```bash
npm run turbo
```

---

To run drizzle-studio (i.e., to interact directly with the MySQL database)

```bash
npm run drizzle
```

Open [https://local.drizzle.studio](https://local.drizzle.studio) with your browser.

---

To update the SQL schema, edit the `schema.ts` file and run

```bash
npx drizzle-kit push:msql
```

to push the changes to PlanetScale.

## Contributors

2024: Aditya Muthukattu, Josh Lim

2023: Prayag Rawat, Adrian Lim, Wanning Cai, Lucas Sutherland, Dulini Galhena, Josh Lim
