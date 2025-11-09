# Introduction

Welcome to Thunder App! This is a modern full-stack monorepo template that'll help you get started building fast, type-safe applications. Think of it as your starting point for building scalable apps with Bun as the runtime, Vite and React for the frontend, Hono for the backend, and a shared TypeScript library to keep everything in sync.

## Motivation

So, why build this? Well, I kept running into the same problem: there wasn't a great way to scaffold a Bun-first project that really prioritized speed and developer experience. Having to set this up manually each time I spun up a side project was a pain and I wanted a way to be able to get started quickly so that I could build what I wanted when I wanted. Speed and Bun were the main drivers here. I wanted something that takes full advantage of Bun's incredible performance while still giving you that modern, type-safe development experience we all love.

This project takes a lot of inspiration from [create-t3-app](https://create.t3.gg/), which has done an amazing job making typesafe Next.js apps easy to set up. Thunder App follows similar principles but is built specifically for the Bun ecosystem, giving you a fast, modular approach to full-stack TypeScript development.

## Strictness

Fair warning: this project is pretty opinionated. TypeScript is non-negotiable, and I've kept the TypeScript config and lint rules as strict as possible. Why? Because it keeps your intentions crystal clear. I know it can feel a bit overwhelming at first, but once you get used to it, you'll find your codebase is way easier to maintain and honestly more fun to work with. Those strict rules catch bugs early, improve code quality, and make refactoring feel safe instead of scary.

## Key Features

Here's what you get out of the box:

- **Monorepo Structure**: Everything lives in one place: frontend, backend, and shared lib are all managed with Bun workspaces.
- **Frontend**: React 19 with Vite 5, Tailwind CSS v4, React Query for data fetching, and Auth.js integration.
- **Backend**: Hono v4 web framework, Drizzle ORM with PostgreSQL, Zod for validation, and Auth.js for authentication.
- **Shared Lib**: Type-safe shared code between frontend and backend, so you're not duplicating types everywhere.
- **Development Tools**: Scripts for dev, build, lint, typecheck, and database management, everything you need to get productive fast.

With Thunder App, you can skip the setup headaches and jump straight into building the features that matter to you.
