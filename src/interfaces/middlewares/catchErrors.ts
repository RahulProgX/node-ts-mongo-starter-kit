import { ErrorCode } from "../../common/enums/errorCode.enum.js";
import { AppError } from "../../common/errors/AppError.js";
import { HTTPSTATUS, type THttpStatusCode } from "../../config/http.config.js";

export class HttpException extends AppError{
    constructor(message="Http exception Error", statusCode:THttpStatusCode, errorCode?:ErrorCode){
        super(message,statusCode, errorCode)
    }
}

export class NotFoundException extends AppError{
    constructor(message="Resource not found"){
        super(message,HTTPSTATUS.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND)
    }
}


export class BadRequestException extends AppError{
    constructor(message="Bad Request",errorCode?:ErrorCode){
        super(message,HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCode.AUTH_USER_NOT_FOUND )
    }
}


export class UnAuthorizedException extends AppError{
    constructor(message="Unauthorized Access", errorCode?:ErrorCode){
        super(message, HTTPSTATUS.UNAUTHORIZED,errorCode || ErrorCode.ACCESS_UNAUTHORIZED)
    }
}

export class InternalServerException extends AppError{
     constructor(message="Internal Server Error", errorCode?:ErrorCode){
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR,errorCode || ErrorCode.INTERNAL_SERVER_ERROR)
    }
}