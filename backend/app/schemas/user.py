from pydantic import BaseModel, EmailStr, Field


class UpdateProfileRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=3)

    company: str | None = None
    department: str | None = None
    designation: str | None = None
    language: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class ChangeRoleRequest(BaseModel):
    role: str


class UserListResponse(BaseModel):
    id: str

    full_name: str
    email: EmailStr

    role: str
    department: str | None = None

    awareness_score: int
    is_verified: bool
    is_active: bool


class XPUpdateRequest(BaseModel):
    xp: int


class ToggleUserStatusRequest(BaseModel):
    is_active: bool