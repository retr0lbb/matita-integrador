import { Injectable } from "@nestjs/common";
import { GoogleClassroomClient } from "../domain/ports/google-classroom-client";
import { ConfigService } from "@nestjs/config";
import { classroom_v1, google } from "googleapis";

@Injectable()
export class GoogleClassroomAdapter implements GoogleClassroomClient{

    private readonly classroom: classroom_v1.Classroom

    constructor(private readonly configService: ConfigService){
        const creds = JSON.parse(this.configService.getOrThrow<string>("GOOGLE_API_JSON"))

        const auth = new google.auth.JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/classroom.courses',
                'https://www.googleapis.com/auth/classroom.rosters',
            ],
            subject: this.configService.getOrThrow<string>("GOOGLE_CLIENT_EMAIL")
        })


        this.classroom = google.classroom({version: "v1", auth})
    }

    async findClassroom(courseId: string): Promise<boolean> {
        const course = await this.classroom.courses.get({
           id: courseId
        })

        console.log(course.data)
        
        return course.ok
    }

    async createCourse(input: { name: string; ownerEmail: string; section?: string; }): Promise<string> {
        const response = await this.classroom.courses.create({
            requestBody: {
                name: input.name,
                section: input.section,
                ownerId: input.ownerEmail,
                courseState: "ACTIVE"
            }
        })

        return response.data.id!;
    }

    async addTeacher(courseId: string, teacherEmail: string): Promise<void> {
        await this.classroom.courses.teachers.create({courseId, requestBody: {userId: teacherEmail}})
    }

    async addStudent(courseId: string, studentEmail: string): Promise<void> {
        await this.classroom.courses.students.create({courseId, requestBody: {userId: studentEmail}})
    }
    
}