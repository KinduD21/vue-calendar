# Vue Calendar

## Run the Application Locally

### 1. Install Dependencies

Install project dependencies:

```bash
npm install
```

### 2. Run the Application (Development Mode)

Start the application in development mode:

```bash
npm run dev
```

## Code Style and Formatting

Run linting checks to maintain code quality:

```bash
# Show style errors and warnings
npm run lint

# Automatically fix style issues
npm run lint:fix

# Run linter in CI mode (fails on warnings and errors)
npm run lint:ci
```

## TypeScript Checks

Run TypeScript checks to ensure type safety:

```bash
npm run ts:check
```

## Unit Tests

Run automated unit tests:

```bash
npm run test:unit
```

## Build the application

Prepare the app for production:

```bash
# Build the app
npm run build
```

## Run the Built Application (Production Mode)

Start the built app from the `/dist` directory:

```bash
npm run preview
```

## Update Browserslist Database

Keep the [Browserslist DB](https://browsersl.ist/) up to date:

```bash
npx browserslist@latest --update-db
```
