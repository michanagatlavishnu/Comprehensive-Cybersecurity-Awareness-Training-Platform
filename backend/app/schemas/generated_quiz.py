from typing import List, Optional

from pydantic import BaseModel, Field, model_validator


# ==========================================================
# AI QUIZ GENERATION REQUEST
# ==========================================================

class GenerateQuizRequest(BaseModel):
    module_id: str
    lesson_id: Optional[str] = None

    number_of_questions: int = Field(default=10, ge=5, le=30)

    difficulty: str = "beginner"  # beginner | intermediate | advanced

    language: str = "en"


# ==========================================================
# GENERATED QUESTION RESPONSE
# ==========================================================

class GeneratedQuestion(BaseModel):
    question_id: str

    question: str

    options: List[str]

    explanation: str

    topic: str

    difficulty: str

    marks: int


# ==========================================================
# GENERATED QUIZ RESPONSE
# ==========================================================

class GeneratedQuizResponse(BaseModel):
    quiz_id: str

    title: str

    module_title: str

    difficulty: str

    total_questions: int

    time_limit_minutes: int

    passing_score: int

    xp_reward: int

    language: str

    questions: List[GeneratedQuestion]


# ==========================================================
# ANSWER MODEL
# ==========================================================

class QuizAnswer(BaseModel):
    question_id: str

    selected_option: int | None = None
    selected_answers: List[int] | int | None = None

    @model_validator(mode="after")
    def normalize_selected_option(self):
        if self.selected_option is None and self.selected_answers is not None:
            selected_answers = (
                self.selected_answers
                if isinstance(self.selected_answers, list)
                else [self.selected_answers]
            )
            if selected_answers:
                self.selected_option = selected_answers[0]
        if self.selected_option is None:
            raise ValueError("A selected answer is required.")
        return self


# ==========================================================
# QUIZ SUBMISSION REQUEST
# ==========================================================

class SubmitQuizRequest(BaseModel):
    quiz_id: str | None = None

    answers: List[QuizAnswer]

    duration_minutes: float = Field(default=0)


# ==========================================================
# QUESTION RESULT
# ==========================================================

class QuestionResultResponse(BaseModel):
    question_id: str

    question: str

    selected_option: int

    correct_option: int

    is_correct: bool

    explanation: str

    marks_awarded: int

    topic: str


# ==========================================================
# QUIZ SUBMISSION RESPONSE
# ==========================================================

class SubmitQuizResponse(BaseModel):
    quiz_id: str

    score: float

    total_marks: int

    percentage: float

    passed: bool

    xp_awarded: int

    awareness_score: int

    level: int

    results: List[QuestionResultResponse]


# ==========================================================
# QUIZ HISTORY
# ==========================================================

class QuizHistoryItem(BaseModel):
    attempt_id: str

    quiz_id: str

    quiz_title: str

    percentage: float

    passed: bool

    xp_awarded: int

    completed_at: str


class QuizHistoryResponse(BaseModel):
    history: List[QuizHistoryItem]


# ==========================================================
# AI EXPLANATION REQUEST
# ==========================================================

class ExplainQuestionRequest(BaseModel):
    question: str

    selected_option: str

    correct_option: str

    topic: str

    language: str = "en"


# ==========================================================
# AI EXPLANATION RESPONSE
# ==========================================================

class ExplainQuestionResponse(BaseModel):
    explanation: str

    prevention_tip: str