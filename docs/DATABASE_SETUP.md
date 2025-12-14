# Database Setup Guide - AssignmentGhar

This guide will help you set up the PostgreSQL database with Prisma for the AssignmentGhar project.

## Prerequisites

- PostgreSQL installed on your system ([Download](https://www.postgresql.org/download/))
- Node.js and pnpm installed

## Database Setup Steps

### 1. Install PostgreSQL

If you haven't already, install PostgreSQL:

- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: Use Homebrew: `brew install postgresql`
- **Linux**: Use your package manager: `sudo apt-get install postgresql`

### 2. Create Database

Open PostgreSQL command line (psql) or pgAdmin and create the database:

```sql
CREATE DATABASE assignmentghar;
```

### 3. Configure Environment Variables

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/assignmentghar"
```

Replace:

- `USERNAME` with your PostgreSQL username (default: `postgres`)
- `PASSWORD` with your PostgreSQL password

Example:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/assignmentghar"
```

### 4. Run Prisma Migrations

Create the database tables from the schema:

```bash
npx prisma migrate dev --name init
```

This will:

- Create all tables defined in `prisma/schema.prisma`
- Generate the Prisma Client
- Apply the migration to your database

### 5. (Optional) Seed the Database

If you want to add sample data, create a seed file and run:

```bash
npx prisma db seed
```

### 6. View Your Database

Open Prisma Studio to view and edit your data:

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

## Database Schema

The current schema includes:

### Models:

- **User**: Stores user information (students, admins, experts)
- **Assignment**: Assignment submissions and details
- **Order**: Payment and order tracking

### Enums:

- **UserRole**: STUDENT, ADMIN, EXPERT
- **AssignmentStatus**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- **OrderStatus**: PENDING, PAID, FAILED, REFUNDED

## Useful Prisma Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View migration status
npx prisma migrate status
```

## Using Prisma in Your Code

Import and use the Prisma client:

```typescript
import prisma from "@/lib/prisma";

// Example: Create a new user
const user = await prisma.user.create({
  data: {
    email: "student@example.com",
    name: "Your Name",
    role: "STUDENT",
  },
});

// Example: Find assignments
const assignments = await prisma.assignment.findMany({
  where: {
    status: "PENDING",
  },
  include: {
    user: true,
  },
});
```

## Troubleshooting

### Connection Issues

If you get a connection error:

1. Verify PostgreSQL is running: `pg_isready`
2. Check your DATABASE_URL in `.env`
3. Ensure the database exists: `psql -l`

### Migration Issues

If migrations fail:

```bash
# Reset and start fresh (WARNING: Deletes data)
npx prisma migrate reset

# Or manually fix conflicts
npx prisma migrate resolve
```

### Client Generation Issues

If Prisma Client imports fail:

```bash
npx prisma generate
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js with Prisma](https://www.prisma.io/nextjs)

## Support

For issues specific to AssignmentGhar database setup, contact the development team.
