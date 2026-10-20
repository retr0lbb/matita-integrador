import { Test, type TestingModule } from "@nestjs/testing";
import {
  GOOGLE_ACCOUNT_PROVIDER,
  type GoogleAccountProviderClient,
} from "../../../accounts/domain/google-account-provider";
import { UserRole } from "../../../users/domain/value-objects/user-role";
import { Classroom, ClassroomStatus } from "../../domain/classroom.entity";
import {
  CLASSROOM_REPOSITORY,
  type ClassRoomRepository,
} from "../../domain/ports/classroom.repository";
import {
  CLASSROOM_OWNER_QUERY,
  type ClassroomOwnerQuery,
} from "../../domain/ports/classroom-owner.query";
import {
  GOOGLE_CLASSROOM_CLIENT,
  type GoogleClassroomClient,
} from "../../domain/ports/google-classroom-client";
import {
  USER_CLASSROOM_REPOSITORY,
  type UserClassRepository,
} from "../../domain/ports/user-classroom.repository";
import { AddUserToClassRoom } from "./add-user-to-classroom.usecase";

describe("AddUserToClassRoom", () => {
  let useCase: AddUserToClassRoom;
  let userClassroomRepo: jest.Mocked<UserClassRepository>;
  let googleClassroomClient: jest.Mocked<GoogleClassroomClient>;
  let classroomRepo: jest.Mocked<ClassRoomRepository>;
  let classroomOwnerQuery: jest.Mocked<ClassroomOwnerQuery>;
  let googleAccountProvider: jest.Mocked<GoogleAccountProviderClient>;

  beforeEach(async () => {
    userClassroomRepo = {
      getUserToClassroom: jest.fn(),
      getClassStudents: jest.fn(),
      saveUserToClassroom: jest.fn(),
      removeUserFromClassroom: jest.fn(),
    };

    googleClassroomClient = {
      createCourse: jest.fn(),
      addTeacher: jest.fn(),
      addStudent: jest.fn(),
      findClassroom: jest.fn(),
      archiveClassroom: jest.fn(),
    };

    classroomRepo = {
      save: jest.fn(),
      findClassroomById: jest.fn(),
      findByProviderExternalId: jest.fn(),
      listClassrooms: jest.fn(),
    };

    classroomOwnerQuery = {
      findByUserId: jest.fn(),
    };

    googleAccountProvider = {
      createAccount: jest.fn(),
      listAllAccounts: jest.fn(),
      findAccount: jest.fn(),
      deleteAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddUserToClassRoom,
        { provide: USER_CLASSROOM_REPOSITORY, useValue: userClassroomRepo },
        { provide: GOOGLE_CLASSROOM_CLIENT, useValue: googleClassroomClient },
        { provide: CLASSROOM_REPOSITORY, useValue: classroomRepo },
        { provide: CLASSROOM_OWNER_QUERY, useValue: classroomOwnerQuery },
        { provide: GOOGLE_ACCOUNT_PROVIDER, useValue: googleAccountProvider },
      ],
    }).compile();

    useCase = module.get<AddUserToClassRoom>(AddUserToClassRoom);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = "user-123";
  const classRoomId = "classroom-123";
  const mockClassroomOwner = {
    accountId: "account-123",
    userId: "user-123",
    role: UserRole.ALUNO,
    googleExternalId: "google-user-123",
  };
  const mockClassroom = Classroom.reconstitute({
    id: classRoomId,
    title: "Test Classroom",
    unitId: "unit-123",
    ownerId: "owner-123",
    status: ClassroomStatus.ACTIVE,
    googleId: "google-course-123",
    lexId: null,
  });
  const mockGoogleAccount = {
    id: "google-account-123",
    email: "student@example.com",
  };

  describe("execute", () => {
    it("should add student to classroom successfully", async () => {
      // Arrange
      classroomOwnerQuery.findByUserId.mockResolvedValue(mockClassroomOwner);
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);
      classroomRepo.findClassroomById.mockResolvedValue(mockClassroom);
      googleAccountProvider.findAccount.mockResolvedValue(mockGoogleAccount);
      googleClassroomClient.findClassroom.mockResolvedValue(true);
      googleClassroomClient.addStudent.mockResolvedValue(undefined);
      userClassroomRepo.saveUserToClassroom.mockResolvedValue(undefined);

      // Act
      await useCase.execute(userId, classRoomId);

      // Assert
      expect(classroomOwnerQuery.findByUserId).toHaveBeenCalledWith(userId);
      expect(userClassroomRepo.getUserToClassroom).toHaveBeenCalledWith(
        userId,
        classRoomId,
      );
      expect(classroomRepo.findClassroomById).toHaveBeenCalledWith(classRoomId);
      expect(googleAccountProvider.findAccount).toHaveBeenCalledWith(
        mockClassroomOwner.googleExternalId,
      );
      expect(googleClassroomClient.findClassroom).toHaveBeenCalledWith(
        mockClassroom.googleId,
      );
      expect(googleClassroomClient.addStudent).toHaveBeenCalledWith(
        mockClassroom.googleId,
        mockGoogleAccount.email,
      );
      expect(userClassroomRepo.saveUserToClassroom).toHaveBeenCalledWith(
        mockClassroomOwner.userId,
        classRoomId,
      );
    });

    it("should throw error when user already in classroom", async () => {
      // Arrange
      classroomOwnerQuery.findByUserId.mockResolvedValue(mockClassroomOwner);
      userClassroomRepo.getUserToClassroom.mockResolvedValue({
        id: "relation-123",
        userId,
        classRoomId,
      });

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "Relation already exists",
      );

      expect(classroomRepo.findClassroomById).not.toHaveBeenCalled();
      expect(googleClassroomClient.addStudent).not.toHaveBeenCalled();
    });

    it("should throw error when user and account not found", async () => {
      // Arrange
      classroomOwnerQuery.findByUserId.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "User and account not found",
      );

      expect(userClassroomRepo.getUserToClassroom).not.toHaveBeenCalled();
      expect(classroomRepo.findClassroomById).not.toHaveBeenCalled();
    });

    it("should throw error when user has no Google external ID", async () => {
      // Arrange
      const ownerWithoutGoogleId = {
        ...mockClassroomOwner,
        googleExternalId: null,
      };
      classroomOwnerQuery.findByUserId.mockResolvedValue(ownerWithoutGoogleId);
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "Google Id or email must be provided",
      );

      expect(classroomRepo.findClassroomById).not.toHaveBeenCalled();
      expect(googleAccountProvider.findAccount).not.toHaveBeenCalled();
    });

    it("should throw error when classroom not found or not created", async () => {
      // Arrange
      classroomOwnerQuery.findByUserId.mockResolvedValue(mockClassroomOwner);
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);
      classroomRepo.findClassroomById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "Classroom doesnot exists or has not been created yet",
      );

      expect(googleAccountProvider.findAccount).not.toHaveBeenCalled();
      expect(googleClassroomClient.addStudent).not.toHaveBeenCalled();
    });

    it("should throw error when classroom has no Google ID", async () => {
      // Arrange
      const classroomWithoutGoogleId = Classroom.reconstitute({
        id: classRoomId,
        title: "Test Classroom",
        unitId: "unit-123",
        ownerId: "owner-123",
        status: ClassroomStatus.ACTIVE,
        googleId: null,
        lexId: null,
      });
      classroomOwnerQuery.findByUserId.mockResolvedValue(mockClassroomOwner);
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);
      classroomRepo.findClassroomById.mockResolvedValue(
        classroomWithoutGoogleId,
      );

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "Classroom doesnot exists or has not been created yet",
      );

      expect(googleAccountProvider.findAccount).not.toHaveBeenCalled();
      expect(googleClassroomClient.addStudent).not.toHaveBeenCalled();
    });

    it("should throw error when Google account not found", async () => {
      // Arrange
      classroomOwnerQuery.findByUserId.mockResolvedValue(mockClassroomOwner);
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);
      classroomRepo.findClassroomById.mockResolvedValue(mockClassroom);
      googleAccountProvider.findAccount.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "User account doesnot exists",
      );

      expect(googleClassroomClient.findClassroom).not.toHaveBeenCalled();
      expect(googleClassroomClient.addStudent).not.toHaveBeenCalled();
    });

    it("should throw error when user is not a student (ALUNO)", async () => {
      // Arrange
      const ownerWithProfessorRole = {
        ...mockClassroomOwner,
        role: UserRole.PROFESSOR,
      };
      classroomOwnerQuery.findByUserId.mockResolvedValue(
        ownerWithProfessorRole,
      );
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);
      classroomRepo.findClassroomById.mockResolvedValue(mockClassroom);
      googleAccountProvider.findAccount.mockResolvedValue(mockGoogleAccount);

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "Only students must be able to be added into a classroom",
      );

      expect(googleClassroomClient.findClassroom).not.toHaveBeenCalled();
      expect(googleClassroomClient.addStudent).not.toHaveBeenCalled();
    });

    it("should throw error when Google Classroom not found", async () => {
      // Arrange
      classroomOwnerQuery.findByUserId.mockResolvedValue(mockClassroomOwner);
      userClassroomRepo.getUserToClassroom.mockResolvedValue(null);
      classroomRepo.findClassroomById.mockResolvedValue(mockClassroom);
      googleAccountProvider.findAccount.mockResolvedValue(mockGoogleAccount);
      googleClassroomClient.findClassroom.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(userId, classRoomId)).rejects.toThrow(
        "Classroom doesnot exists",
      );

      expect(googleClassroomClient.addStudent).not.toHaveBeenCalled();
      expect(userClassroomRepo.saveUserToClassroom).not.toHaveBeenCalled();
    });
  });
});
