export const GOOGLE_CLASSROOM_CLIENT = Symbol('GOOGLE_CLASSROOM_CLIENT');

export interface GoogleClassroomClient {
  createCourse(input: { name: string; ownerEmail: string; section?: string }): Promise<string>; // retorna courseId
  addTeacher(courseId: string, teacherEmail: string): Promise<void>;
  addStudent(courseId: string, studentEmail: string): Promise<void>;
  findClassroom(courseId: string): Promise<boolean>;
  archiveClassroom(courseId: string): Promise<void>
}

