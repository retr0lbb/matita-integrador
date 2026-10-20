import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from "../../../accounts/domain/account.repository";
import {
  GOOGLE_ACCOUNT_PROVIDER,
  type GoogleAccountProviderClient,
} from "../../../accounts/domain/google-account-provider";
import {
  UNIT_REPOSITORY,
  type UnitRepository,
} from "../../../unit/domain/unity.repository";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "../../../users/domain/user.repository";
import { UserRole } from "../../../users/domain/value-objects/user-role";
import { type Classroom, ClassroomStatus } from "../../domain/classroom.entity";
import {
  CLASSROOM_REPOSITORY,
  type ClassRoomRepository,
} from "../../domain/ports/classroom.repository";
import {
  GOOGLE_CLASSROOM_CLIENT,
  type GoogleClassroomClient,
} from "../../domain/ports/google-classroom-client";
import { CreateClassRoomUseCase } from "./create-classroom.usecase";

describe("CreateClassRoomUseCase", () => {
  let useCase: CreateClassRoomUseCase;
  let classroomRepo: jest.Mocked<ClassRoomRepository>;
  let unitRepo: jest.Mocked<UnitRepository>;
  let accountRepo: jest.Mocked<AccountRepository>;
  let googleClassroomClient: jest.Mocked<GoogleClassroomClient>;
  let googleAccountProvider: jest.Mocked<GoogleAccountProviderClient>;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);

    unitRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      listUnity: jest.fn(),
      listUnitClassrooms: jest.fn(),
    };

    accountRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByProviderAndExternalId: jest.fn(),
      findByUserAndProvider: jest.fn(),
      findByEmailAndExternalProvider: jest.fn(),
      listAccount: jest.fn(),
      updateGoogleIdForAccount: jest.fn(),
      setFailedPending: jest.fn(),
      delete: jest.fn(),
    };

    userRepo = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    googleClassroomClient = {
      createCourse: jest.fn(),
      addTeacher: jest.fn(),
      addStudent: jest.fn(),
      findClassroom: jest.fn(),
      archiveClassroom: jest.fn(),
    };

    googleAccountProvider = {
      createAccount: jest.fn(),
      listAllAccounts: jest.fn(),
      findAccount: jest.fn(),
      deleteAccount: jest.fn(),
    };

    classroomRepo = {
      save: saveMock,
      findClassroomById: jest.fn(),
      findByProviderExternalId: jest.fn(),
      listClassrooms: jest.fn(),
    };

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

  const unitId = "unit-123";
  const basePayload = {
    title: "Test Classroom",
    ownerAccountId: "account-123",
  };

  const mockUnit = { id: unitId };
  const mockAccount = {
    id: "account-123",
    userId: "user-123",
    email: { getValue: () => "test@example.com" },
  };
  const mockUser = {
    id: "user-123",
    role: UserRole.PROFESSOR,
  };
  const mockGoogleAccount = {
    id: "google-account-123",
    email: "teacher@example.com",
  };
  const mockGoogleCourseId = "google-course-123";

  describe("execute", () => {
    it("should create classroom and activate with Google Classroom", async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(mockAccount as any);
      userRepo.findById.mockResolvedValue(mockUser as any);
      googleAccountProvider.findAccount.mockResolvedValue(mockGoogleAccount);
      googleClassroomClient.createCourse.mockResolvedValue(mockGoogleCourseId);
      classroomRepo.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(unitId, basePayload);

      // Assert
      expect(unitRepo.findById).toHaveBeenCalledWith(unitId);
      expect(accountRepo.findById).toHaveBeenCalledWith(
        basePayload.ownerAccountId,
      );
      expect(userRepo.findById).toHaveBeenCalledWith(mockAccount.userId);
      expect(googleAccountProvider.findAccount).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(googleClassroomClient.createCourse).toHaveBeenCalledWith({
        name: basePayload.title,
        ownerEmail: mockGoogleAccount.email,
      });
      expect(classroomRepo.save).toHaveBeenCalledTimes(2);
    });

    it("should throw NotFoundException when unit not found", async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        "Unity Not Found",
      );

      expect(unitRepo.findById).toHaveBeenCalledWith(unitId);
      expect(accountRepo.findById).not.toHaveBeenCalled();
      expect(classroomRepo.save).not.toHaveBeenCalled();
    });

    it("should throw error when account not found", async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        "You must provide a valid account",
      );

      expect(unitRepo.findById).toHaveBeenCalledWith(unitId);
      expect(accountRepo.findById).toHaveBeenCalledWith(
        basePayload.ownerAccountId,
      );
      expect(userRepo.findById).not.toHaveBeenCalled();
      expect(classroomRepo.save).not.toHaveBeenCalled();
    });

    it("should throw error when user not found for account", async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(mockAccount as any);
      userRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        "User not found",
      );

      expect(userRepo.findById).toHaveBeenCalledWith(mockAccount.userId);
      expect(classroomRepo.save).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenException when user has ALUNO role", async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(mockAccount as any);
      userRepo.findById.mockResolvedValue({
        id: "user-123",
        role: UserRole.ALUNO,
      } as any);

      // Act & Assert
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        "User from role ALUNO cannot create a classroom",
      );

      expect(classroomRepo.save).not.toHaveBeenCalled();
      expect(googleClassroomClient.createCourse).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException when Google account not found", async () => {
      // Arrange
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(mockAccount as any);
      userRepo.findById.mockResolvedValue(mockUser as any);
      googleAccountProvider.findAccount.mockResolvedValue(null);

      // Act & Assert
      let error: Error | null = null;
      try {
        await useCase.execute(unitId, basePayload);
      } catch (e) {
        error = e as Error;
      }
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error?.message).toBe("Google Account not found");

      expect(googleClassroomClient.createCourse).not.toHaveBeenCalled();
      // First save happens before Google account check
      expect(classroomRepo.save).toHaveBeenCalledTimes(1);
    });

    it("should throw error when account has no email", async () => {
      // Arrange
      const accountWithoutEmail = {
        ...mockAccount,
        email: null,
      };
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(accountWithoutEmail as any);
      userRepo.findById.mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(useCase.execute(unitId, basePayload)).rejects.toThrow(
        "Cannot create a classroom without google account",
      );

      expect(googleAccountProvider.findAccount).not.toHaveBeenCalled();
      expect(classroomRepo.save).toHaveBeenCalledTimes(1);
    });

    it("should save classroom with correct properties", async () => {
      // Arrange
      const payloadWithIds = {
        ...basePayload,
        status: ClassroomStatus.PENDING,
      };
      unitRepo.findById.mockResolvedValue(mockUnit as any);
      accountRepo.findById.mockResolvedValue(mockAccount as any);
      userRepo.findById.mockResolvedValue(mockUser as any);
      googleAccountProvider.findAccount.mockResolvedValue(mockGoogleAccount);
      googleClassroomClient.createCourse.mockResolvedValue(mockGoogleCourseId);
      classroomRepo.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(unitId, payloadWithIds);

      // Assert
      expect(classroomRepo.save).toHaveBeenCalledTimes(2);
      // Verify the save was called with a Classroom entity that has the right properties
      const firstCallArg = classroomRepo.save.mock.calls[0][0];
      expect(firstCallArg.title).toBe(payloadWithIds.title);
      expect(firstCallArg.unitId).toBe(unitId);
      expect(firstCallArg.ownerId).toBe(basePayload.ownerAccountId);
      // Status is always INACTIVE initially (overridden by use case)
      expect(firstCallArg.status).toBe(ClassroomStatus.INACTIVE);

      const secondCallArg = classroomRepo.save.mock.calls[1][0];
      expect(secondCallArg.status).toBe(ClassroomStatus.ACTIVE);
      expect(secondCallArg.googleId).toBe(mockGoogleCourseId);
    });
  });
});
