from typing import Annotated

from fastapi import Depends

from app.middleware.auth import get_current_user
from app.middleware.role import require_admin, require_employee
from app.models.user import User

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]

CurrentAdmin = Annotated[
    User,
    Depends(require_admin()),
]

CurrentEmployee = Annotated[
    User,
    Depends(require_employee()),
]