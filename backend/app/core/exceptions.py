from fastapi import HTTPException, status


class UnauthorizedException(HTTPException):
    def __init__(self, message="Unauthorized"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message,
        )


class ForbiddenException(HTTPException):
    def __init__(self, message="Access Forbidden"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message,
        )


class NotFoundException(HTTPException):
    def __init__(self, message="Resource Not Found"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message,
        )


class BadRequestException(HTTPException):
    def __init__(self, message="Bad Request"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


class ConflictException(HTTPException):
    def __init__(self, message="Conflict"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )


class OTPExpiredException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired. Please request a new OTP.",
        )


class InvalidOTPException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP.",
        )