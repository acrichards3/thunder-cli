# Getting Started

Get up and running with Thunder App in minutes.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Bun** (v1.3 or later) - [Install Bun](https://bun.sh/docs/installation)
- **Node.js** (v22 or later) - Required for some tooling, though Bun handles most of it

_Note: Earlier versions may work but have not been tested_

## Installation

To create a new Thunder App project, run:

```bash
bun create thunder-app@latest
```

The CLI will guide you through the setup process and ask you a few questions about your project configuration.

![Thunder App CLI](/thunder-app-cli.png)

Once the project is created, navigate into your new project directory:

```bash
cd <your-app-name>
```

### Environment Variables

Copy the example environment files for both `frontend` and `backend` and fill in your values. You can see which variables are required by trying to spin up the app.

The backend will show invalid environment variables in the terminal:

![Invalid Env Vars Backend](/invalid-env-backend.png)

And the frontend will show invalid environment variables in the browser console:

![Invalid Env Vars Frontend](/invalid-env-frontend.png)

### Database Setup

Thunder App uses Drizzle ORM with PostgreSQL. To set up your database:

1. Make sure PostgreSQL is running
2. Update your database connection string in `backend/.env`
3. Run the database migrations:

```bash
bun run db:push
```

## Running the Development Server

Start all development environments simultaneously by running this command from the root of the monorepo:

```bash
bun run dev
```

This will start:

- Frontend dev server (defaults to `http://localhost:5173`)
- Lib (watches for file changes)
- Backend API server (defaults to `http://localhost:3000`)

All services support hot module replacement, so your changes will be reflected immediately.

## Next Steps

Now that you're up and running, here are some recommended next steps:

1. **Explore the Project Structure** - Check out the [Project Structure](/project-structure) guide to understand how everything is organized
2. **Set Up Authentication** - Configure Auth.js for user authentication
3. **Read the First Steps Guide** - Head over to [First Steps](/first-steps) for a walkthrough of common tasks

Happy coding!
