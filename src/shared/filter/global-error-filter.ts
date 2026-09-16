import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { DomainError } from "../domains/domain.error";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        if(exception instanceof DomainError){
            response.status(this.getStatus(exception)).json({
                statusCode: this.getStatus(exception),
                code: exception.code,
                message: exception.message,
            });

            return
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            code: "INTERNAL_SERVER_ERROR",
            message: "Ocorreu um erro interno no servidor."
        })

    }


    private getStatus(error: DomainError): number {
    switch (error.code) {
      case "USER_NOT_FOUND":
      case "ACCOUNT_NOT_FOUND":
        return 404;

      case "USER_ALREADY_EXISTS":
      case "ACCOUNT_ALREADY_EXISTS":
        return 409;

      default:
        return 400;
    }
  }

}