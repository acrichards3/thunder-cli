import { TechCard } from "./components/TechCard";
import type { TechCardProps } from "./components/TechCard";

const technologies = [
  {
    description:
      "Bun is an all-in-one JavaScript runtime, bundler, test runner, and package manager. It's incredibly fast and provides a seamless development experience with built-in TypeScript support.",
    href: "https://bun.sh",
    logo: "/logos/logo.svg",
    name: "Bun",
  },
  {
    description:
      "Hono is an ultrafast web framework for the modern web. Built on Web Standards, it's lightweight and perfect for building APIs and full-stack applications with excellent performance.",
    href: "https://hono.dev",
    logo: "/logos/hono.svg",
    name: "Hono",
  },
  {
    description:
      "Auth.js (formerly NextAuth.js) provides flexible, secure, and scalable authentication. It integrates seamlessly with your database and offers a simple API for managing users and sessions.",
    href: "https://authjs.dev",
    logo: "/logos/authjs.png",
    name: "Auth.js",
  },
  {
    description:
      "Drizzle ORM is a lightweight, performant TypeScript ORM with a type-safe API. It's perfect for working with SQL databases and provides excellent developer experience with zero runtime overhead.",
    href: "https://orm.drizzle.team",
    logo: "/logos/drizzle.webp",
    name: "Drizzle",
  },
  {
    description:
      "Vite is a next-generation frontend build tool that provides instant server start and lightning-fast HMR. It's the foundation of modern frontend development with excellent developer experience.",
    href: "https://vite.dev",
    logo: "/logos/vite.svg",
    name: "Vite",
  },
  {
    description:
      "Tailwind CSS is a utility-first CSS framework that helps you build beautiful, responsive designs without leaving your HTML. It's completely customizable and works perfectly with modern React applications.",
    href: "https://tailwindcss.com",
    logo: "/logos/tailwind.svg",
    name: "Tailwind CSS",
  },
  {
    description:
      "React Query (TanStack Query) is powerful data synchronization for React. It makes fetching, caching, synchronizing and updating server state in your React applications a breeze.",
    href: "https://tanstack.com/query",
    logo: "/logos/react-query.svg",
    name: "React Query",
  },
  {
    description:
      "TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions to help catch errors early and improve developer experience with better tooling.",
    href: "https://www.typescriptlang.org",
    logo: "/logos/typescript.svg",
    name: "TypeScript",
  },
  {
    description:
      "Zod is a TypeScript-first schema validation library. It provides a simple, declarative API for runtime type checking and validation, ensuring data integrity across your application.",
    href: "https://zod.dev",
    logo: "/logos/zod.webp",
    name: "Zod",
  },
] as const satisfies TechCardProps[];

export function App() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 justify-start px-4 py-12">
      <div className="flex flex-col items-center gap-4">
        <img
          alt="Thunder App Logo"
          className="h-20 w-20 drop-shadow-lg"
          src="/logos/thunder-app.png"
        />
        <h1 className="text-5xl font-bold text-white drop-shadow-md">
          <span className="text-cyan-400">Thunder</span> Docs
        </h1>
        <p className="text-gray-300 text-lg">
          Documentation and resources for Thunder App technologies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {technologies.map((tech) => (
          <TechCard
            description={tech.description}
            href={tech.href}
            key={tech.name}
            logo={tech.logo}
            name={tech.name}
          />
        ))}
      </div>
    </main>
  );
}
