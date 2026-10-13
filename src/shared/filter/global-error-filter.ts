import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { DomainError } from "../domains/domain.error";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        if(exception instanceof DomainError){
            response.status(exception.statusCode ?? 400).json({
              message: exception.message
            })

            return
        }

        console.error(exception)

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            code: "INTERNAL_SERVER_ERROR",
            message: "Ocorreu um erro interno no servidor."
        })

    }
}