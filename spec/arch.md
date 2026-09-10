# Architecture — Integrador Project

This document describes the architectural pattern adopted in this project (hexagonal architecture / ports & adapters, on top of NestJS + Drizzle) and the step-by-step sequence for building a new feature. It serves as a reference for anyone (or any AI agent) implementing code in this project.

## 1. Motivation

The system needs to accept data from **multiple sources** (CSV upload via API, hourly polling of an external ERP, webhooks fired by the ERP) and propagate changes to **multiple destinations** (local database, Google Workspace for Education, alerts to the dev team, a processing queue). Hexagonal architecture isolates business logic (the "sync engine" and each domain's rules) from these technical details, so that:

- Swapping or adding a data source/destination doesn't require changing business logic.
- Business logic is testable without a database, without HTTP, and without any external API.

## 2. Folder structure

Each domain (e.g. `users`, `accounts`) is organized into **only two main folders**, plus the NestJS module file at the root:

```
src/
  <domain>/
    domain/
      <domain>.entity.ts
      <domain>.repository.ts         # port: interface + Symbol token
      <field>.vo.ts                  # value objects specific to this domain
      <specific-error>.error.ts      # domain errors
      <use-case>.usecase.ts
    infra/
      drizzle-<domain>.repository.ts  # adapter implementing the port
      <domain>.controller.ts          # inbound adapter (HTTP)
      <domain>.dto.ts                 # Zod schema for the request
    <domain>.module.ts

  shared/
    email.vo.ts                # value objects reused across domains
    domain.error.ts            # abstract base class for domain errors

  database/
    providers/
      drizzle.provider.ts      # Drizzle client as a provider (DRIZZLE token)
    schemas/
      <table>.schema.ts
    database.module.ts
```

**Decision rule for any new file**: does the code know the name of a specific technology (Drizzle, HTTP, a status code, a third-party library)? If yes → `infra/`. If not (even if it depends on an interface/token) → `domain/`.

**Rule to avoid excessive folders**: if a subfolder would only ever contain 1 file, it shouldn't exist. Only create a subfolder when there are 3+ related files.

## 3. Components and responsibilities

### 3.1 Entity (`domain/*.entity.ts`)

Represents data plus the rules that protect the consistency of that data. It knows nothing about databases, HTTP, or any external technology.

- **Private** constructor.
- `static create(props)`: creates a brand-new instance, validating everything (used when the object is born).
- `static restore(props)`: reconstructs an instance from data that has already been validated (used by the repository adapter when reading from the database).
- Business methods that only depend on the object's own data (e.g. `rename()`, `isProfessor()`, `linkToGoogleAccount()`).
- Getters/accessors instead of mutable public properties.
- References other entities **by ID**, never embedding the full instance (unless the child entity has no meaning outside its parent).

### 3.2 Value Object (`domain/*.vo.ts`)

Used when a field has its own validation/formatting rule and **has no identity** (two VOs with the same value are equal). Compared by value (`equals()`), not by reference.

- Private constructor, `static create(value)` that validates (can use Zod internally) and throws a custom domain error when the value is invalid.
- Examples in this project: `Email`, `UserId`, `AccountStatus`.
- VOs used by more than one domain (e.g. `Email`) live in `shared/`.

### 3.3 Domain errors (`domain/*.error.ts` or `shared/domain.error.ts`)

- Every business error class extends an abstract `DomainError extends Error`.
- Never use NestJS exceptions (`BadRequestException`, `NotFoundException`, etc.) inside `domain/` — this couples business logic to the HTTP transport.
- A generic exception filter (`DomainErrorFilter`, in `infra/` or a shared module) catches `DomainError` and translates it into the appropriate HTTP response.

### 3.4 Repository port (`domain/*.repository.ts`)

- A TypeScript interface describing what the domain needs to persist/query (`save`, `findById`, `findByEmail`, etc.).
- A `Symbol` token, exported from the same file, used for NestJS dependency injection (interfaces are erased at runtime, so the token is what Nest actually injects).
- There can also be **external service ports** (e.g. `GoogleWorkspaceClient`) following the same pattern, when the domain depends on a third-party API.

### 3.5 Use Case (`domain/*.usecase.ts`)

- Marked with `@Injectable()`.
- Injects ports via `@Inject(TOKEN)` in the constructor, typed by the interface.
- Orchestrates: fetches data through the ports, applies rules that depend on **external state** (e.g. checking email uniqueness before creating), and delegates to the Entity/VO the rules that depend only on their own data.
- Throws domain errors (never NestJS exceptions).
- Never imports Drizzle, an HTTP client, or anything from `infra/` directly — only the interfaces from `domain/`.

### 3.6 Repository adapter (`infra/drizzle-*.repository.ts`)

- Implements the corresponding port, using Drizzle for real.
- The only place (along with the read path) where translation between a database row and the Entity happens: `Entity.restore(row)` when reading, `entity.getX()` when building the `insert`/`update`.
- Marked with `@Injectable()`.

### 3.7 External service adapter (`infra/*.client.ts`)

- Implements the external service port (e.g. `GoogleWorkspaceClient`), making the actual HTTP call to the third-party API.

### 3.8 Inbound DTO (`infra/*.dto.ts`)

- A Zod schema that validates **the shape of the request** (required fields, types) — different from Value Object validation, which validates the **business rule** of the value.
- One DTO per route/endpoint.

### 3.9 Controller (`infra/*.controller.ts`)

- Receives the request, validates it with the Zod DTO, calls the Use Case via **plain class injection** (no token — concrete classes are not erased at runtime).
- Does not `try/catch` domain errors; the `DomainErrorFilter` handles that globally.

### 3.10 Module (`<domain>.module.ts`)

- Sits at the root of the domain, outside both `domain/` and `infra/` — it's neither business logic nor a technical detail, it's the "glue" between the two.
- Registers in the `providers` array:
  - The Use Case(s) directly.
  - `{ provide: TOKEN, useClass: Adapter }` for each port (repository, external client).
- Imports `DatabaseModule` when it needs the shared Drizzle client.

### 3.11 Shared database (`database/`)

- `drizzle.provider.ts`: exposes the Drizzle client as a provider (`useFactory`), under a token (`DRIZZLE`), so it can be injected and mocked in tests.
- `schemas/`: Drizzle table definitions. Shared across domains because tables may reference each other (e.g. `accounts` referencing `users`).
- `DatabaseModule`: exports the client provider for domain modules to import.

## 4. End-to-end request flow

1. An inbound adapter receives the raw data (HTTP request, a CSV row, a webhook payload).
2. The Zod DTO (when the input is HTTP) validates the shape.
3. The Controller calls the Use Case.
4. The Use Case fetches what it needs through the ports (repositories, external clients).
5. The Use Case invokes `Entity.create()` / VO methods to apply pure rules — which may throw domain errors.
6. The Use Case invokes outbound ports to persist and/or propagate changes (`repository.save()`, `client.createAccount()`, etc.).
7. If something fails, a domain error bubbles up to the `DomainErrorFilter`, which translates it into the proper HTTP response.
8. The Controller returns the success response.

## 5. Step-by-step for building a new domain

1. **Entity** — create the class with `create()`/`restore()` and its own rules.
2. **Value Objects** — extract fields that have their own rule and no identity (use Zod internally for validation).
3. **Domain errors** — create the specific classes needed, extending `DomainError`.
4. **Repository port** — interface + Symbol token.
5. **Repository adapter** — implementation using Drizzle.
6. **External service port(s)** (if any) + the corresponding adapter.
7. **Use case(s)** — start with `create`, then `find`/`update`/`delete` as needed.
8. **Inbound DTO** with Zod.
9. **Controller**.
10. **Module** — register providers (`useClass` for each port), import `DatabaseModule` if needed.
11. **Test the use case in isolation**, with a fake/in-memory implementation of the port, before wiring up the real adapter.

## 6. Review checklist before considering a feature done

- [ ] The Entity does not import anything from `infra/` or from technical libraries (Drizzle, HTTP).
- [ ] Every rule that depends on external state (database, API) lives in the Use Case, not the Entity.
- [ ] Every async call has `await`.
- [ ] Errors thrown in `domain/` are `DomainError` classes, never NestJS exceptions.
- [ ] Fields with their own rule (email, status, typed IDs) use a Value Object instead of a raw `string`/`number`.
- [ ] Entities reference other entities by ID, never embedding the full instance without a real need.
- [ ] Each port has a Symbol token and is registered in `module.ts` with `useClass` (or `useFactory`) pointing to the correct adapter.
- [ ] No subfolder contains a single file without a real reason.