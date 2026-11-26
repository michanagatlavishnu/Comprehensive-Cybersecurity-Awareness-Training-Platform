from pydantic import BaseModel


class SubmitAnswer(BaseModel):
    question_id: str
    selected_answers: list[int]


class SubmitQuizRequest(BaseModel):
    answers: list[SubmitAnswer]