## Overview

This project uses

- [Next.js](https://nextjs.org/learn)
- [Tailwind CSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)
- [Auth.js](https://authjs.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)

---

Once you have cloned the repository locally, run

```bash
npm install
```

to download all necessary packages.

Ensure that you have Prettier (VSCode extension or other) installed to lint your code before you commit + push.

## Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

You can also edit the `package.json` file to add the `--turbo` flag for much
faster compilation times (but possibly buggy behaviour)

```json
"scripts": {
    "dev": "next dev --turbo",
    ...
}
```

---

To run drizzle-studio (i.e., to interact directly with the MySQL database)

```bash
npx drizzle-kit studio
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
