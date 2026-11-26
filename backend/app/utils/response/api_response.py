from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


def success_response(
    message: str,
    data=None,
    status_code: int = 200,
):
    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder(
            {
                "success": True,
                "message": message,
                "data": data,
            }
        ),
    )


def error_response(
    message: str = "Error",
    errors=None,
    status_code: int = 400,
):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "errors": jsonable_encoder(errors),
        },
    )