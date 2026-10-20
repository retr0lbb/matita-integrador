# Testing Guide — Matita Integrador

This document describes the testing conventions for this project. It serves as a reference for anyone (or any AI agent) implementing tests.

## 1. Test Structure & Location

- **Unit tests** are co-located with source files: `*.spec.ts` next to `*.ts`
- **E2E tests** go in `test/` directory (when created)
- Test files follow the pattern: `<source-file>.spec.ts`

## 2. Testing Approach

### Unit Tests (Use Cases & Domain)
- Use **NestJS TestingModule** with mocked providers
- Mock all ports (repositories, external clients) using `jest.fn()` or manual mock implementations
- Test the Use Case in isolation — no real database, no real HTTP calls
- Each test should be independent and not rely on test order

### Integration Tests (Adapters)
- Test repository adapters with a test database (Testcontainers or in-memory)
- Test external adapters (Google, etc.) with mocked HTTP responses

## 3. Unit Test Template

```typescript
// src/classroom/application/useCases/create-classroom.usecase.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CreateClassRoomUseCase } from './create-classroom.usecase';
import { CLASSROOM_REPOSITORY, ClassRoomRepository } from '../../domain/ports/classroom.repository';
import { UNIT_REPOSITORY, UnitRepository } from '../../../unit/domain/unity.repository';
import { ACCOUNT_REPOSITORY, AccountRepository } from '../../../accounts/domain/account.repository';
import { GOOGLE_CLASSROOM_CLIENT, GoogleClassroomClient } from '../../domain/ports/google-classroom-client';
import { GOOGLE_ACCOUNT_PROVIDER, GoogleAccountProviderClient } from '../../../accounts/domain/google-account-provider';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/user.repository';
import { Classroom, ClassroomStatus } from '../../domain/classroom.entity';
import { UserRole } from '../../../users/domain/value-objects/user-role';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CreateClassRoomUseCase', () => {
  let useCase: CreateClassRoomUseCase;
  let classroomRepo: jest.Mocked<ClassRoomRepository>;
  let unitRepo: jest.Mocked<UnitRepository>;
  let accountRepo: jest.Mocked<AccountRepository>;
  let googleClassroomClient: jest.Mocked<GoogleClassroomClient>;
  let googleAccountProvider: jest.Mocked<GoogleAccountProviderClient>;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    // Create mock implementations
    classroomRepo = {
      save: jest.fn(),
      findClassroomById: jest.fn(),
      findByProviderExternalId: jest.fn(),
      listClassrooms: jest.fn(),
    };
    
    unitRepo = {
      findById: jest.fn(),
      listUnitClassrooms: jest.fn(),
    } as any;

    accountRepo = {
      findById: jest.fn(),
    } as any;

    userRepo = {
      findById: jest.fn(),
    } as any;

    googleClassroomClient = {
      createCourse: jest.fn(),
      addTeacher: jest.fn(),
      addStudent: jest.fn(),
      findClassroom: jest.fn(),
      archiveClassroom: jest.fn(),
    };

    googleAccountProvider = {
      findAccount: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClassRoomUseCase,
        { provide: CLASSROOM_REPOSITORY, useValue: classroomRepo },
        { provide: UNIT_REPOSITORY, useValue: unitRepo },
        { provide: ACCOUNT_REPOSITORY, useValue: accountRepo },
        { provide: USER_REPOSITORY, useValue: userRepo },
        { provide: GOOGLE_CLASSROOM_CLIENT, useValue: googleClassroomClient },
        { provide: GOOGLE_ACCOUNT_PROVIDER, useValue: googleAccountProvider },
      ],
    }).compile();

    useCase = module.get<CreateClassRoomUseCase>(CreateClassRoomUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const unitId = 'unit-123';
    const payload = {
      title: 'Test Classroom',
      ownerAccountId: 'account-123',
    };

    it('should create classroom and activate with Google', async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue({ id: unitId } as any);
      accountRepo.findById.mockResolvedValue({ 
        id: 'account-123', 
        userId: 'user-123',
        email: { getValue: () => 'test@example.com' }
      } as any);
      userRepo.findById.mockResolvedValue({ 
        id: 'user-123', 
        role: UserRole.PROFESSOR 
      } as any);
      googleAccountProvider.findAccount.mockResolvedValue({ 
        email: 'teacher@example.com' 
      });
      googleClassroomClient.createCourse.mockResolvedValue('google-course-123');
      classroomRepo.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(unitId, payload);

      // Assert
      expect(classroomRepo.save).toHaveBeenCalledTimes(2);
      expect(googleClassroomClient.createCourse).toHaveBeenCalledWith({
        name: 'Test Classroom',
        ownerEmail: 'teacher@example.com',
      });
    });

    it('should throw NotFoundException when unit not found', async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(unitId, payload)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is ALUNO', async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue({ id: unitId } as any);
      accountRepo.findById.mockResolvedValue({ 
        id: 'account-123', 
        userId: 'user-123',
        email: { getValue: () => 'test@example.com' }
      } as any);
      userRepo.findById.mockResolvedValue({ 
        id: 'user-123', 
        role: UserRole.ALUNO 
      } as any);

      // Act & Assert
      await expect(useCase.execute(unitId, payload)).rejects.toThrow(ForbiddenException);
    });
  });
});
```

## 4. Mocking Conventions

### Repository Ports
- Use `jest.Mocked<Interface>` for type-safe mocks
- Implement only the methods used by the use case under test
- Use `as any` for methods not needed in current test

### External Service Ports
- Mock all methods of the interface
- Return resolved promises for async methods

### Entities & Value Objects
- Use real entity instances via `Entity.create()` or `Entity.reconstitute()`
- Don't mock entities — they are pure domain objects

## 5. Test Naming Convention

- `describe('UseCaseName', () => { ... })`
- `describe('methodName', () => { ... })`
- `it('should <expected behavior> when <condition>', async () => { ... })`
- Use `it` for single assertions, `describe` for grouping related tests

## 6. Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests (when available)
pnpm test:e2e
```

## 7. Key Principles

1. **Test behavior, not implementation** — test what the use case does, not how it does it
2. **One assertion per test** when possible — makes failures easier to diagnose
3. **Arrange-Act-Assert** pattern — clearly separate setup, execution, and verification
4. **Mock at the port level** — never mock internal implementation details
5. **No shared state** — each test creates its own mocks and data
6. **Fast tests** — unit tests should run in milliseconds, no I/O