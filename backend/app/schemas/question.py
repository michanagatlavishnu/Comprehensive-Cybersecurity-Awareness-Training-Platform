from pydantic import BaseModel, Field


class CreateQuestionRequest(BaseModel):
    title: str = Field(min_length=5)

    explanation: str | None = None

    question_type: str = "single_choice"

    options: list[str]

    correct_answers: list[int]

    points: int = 10

    order: int = 1


class UpdateQuestionRequest(BaseModel):
    title: str | None = None

    explanation: str | None = None

    question_type: str | None = None

    options: list[str] | None = None

    correct_answers: list[int] | None = None

    points: int | None = None

    order: int | None = None