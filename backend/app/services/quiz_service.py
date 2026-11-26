from datetime import datetime
from collections import defaultdict
from statistics import mean

from beanie import PydanticObjectId
from pymongo import DESCENDING

from app.core.exceptions import BadRequestException, NotFoundException


from app.models.lesson import Lesson
from app.models.module import LearningModule
from app.models.quiz import Quiz
from app.models.question import Question, OptionModel, CyberTopic
from app.models.quiz_attempt import QuizAttempt, QuestionResult
from app.models.user_progress import UserProgress
from app.models.user import User
from app.models.certificate import Certificate

from app.services.ai_quiz_generator import AIQuizGenerator
from app.services.notification_service import NotificationService
from app.services.localization_service import LocalizationService
from app.services.certificate_service import CertificateService
from app.services.user_service import UserService
from app.schemas.quiz import CreateQuizRequest, UpdateQuizRequest
from app.schemas.question import CreateQuestionRequest, UpdateQuestionRequest
from app.schemas.generated_quiz import (
    GenerateQuizRequest,
    SubmitQuizRequest,
)

class QuizService:

    # ==========================================================
    # QUIZ CRUD
    # ==========================================================

    @staticmethod
    async def create_quiz(payload: CreateQuizRequest):
        try:

            # Validate module
            module = await LearningModule.get(PydanticObjectId(payload.module_id))
            if not module:
                raise NotFoundException("Learning module not found.")

            # Validate lesson
            lesson = await Lesson.get(PydanticObjectId(payload.lesson_id))
            if not lesson:
                raise NotFoundException("Lesson not found.")

            # -------------------------------
            # Create Quiz
            # -------------------------------
            quiz = Quiz(
                module=module,
                lesson=lesson,
                title=payload.title,
                description=payload.description,
                difficulty=payload.difficulty,
                time_limit_minutes=payload.time_limit_minutes,
                passing_score=payload.passing_score,
                xp_reward=payload.xp_reward,
                total_questions=0,
                is_published=True,
            )

            await quiz.insert()

            # -------------------------------
            # AI GENERATE QUESTIONS
            # -------------------------------
            ai_response = await AIQuizGenerator.generate_quiz(
                module_title=module.title,
                lesson_title=lesson.title,
                lesson_content=lesson.content,
                difficulty=payload.difficulty,
                language="en",
                questions=20,
            )

            generated_questions = ai_response.get("questions", [])

            for item in generated_questions:

                options = [
                    OptionModel(
                        text=text,
                        is_correct=index == item["answer_index"],
                    )
                    for index, text in enumerate(item["options"])
                ]
                difficulty_map = {
                    "beginner": "easy",
                    "intermediate": "medium",
                    "advanced": "hard",
                    "easy": "easy",
                    "medium": "medium",
                    "hard": "hard",
                }
                topic_map = {
                    "phishing": CyberTopic.PHISHING,
                    "password": CyberTopic.PASSWORD,
                    "password security": CyberTopic.PASSWORD,
                    "hashing": CyberTopic.PASSWORD,
                    "email": CyberTopic.EMAIL,
                    "email security": CyberTopic.EMAIL,
                    "social engineering": CyberTopic.SOCIAL_ENGINEERING,
                    "network": CyberTopic.NETWORK,
                    "network security": CyberTopic.NETWORK,
                    "malware": CyberTopic.MALWARE,
                    "cloud": CyberTopic.CLOUD,
                    "cloud security": CyberTopic.CLOUD,
                    "data privacy": CyberTopic.DATA_PRIVACY,
                    "mfa": CyberTopic.MFA,
                    "multi factor authentication": CyberTopic.MFA,
                }
                question = Question(
                    quiz_id=str(quiz.id),
                    question=item["question"],
                    options=options,
                    explanation=item["explanation"],
                    topic=topic_map.get(
                        str(item.get("topic", "general security")).lower(),
                        CyberTopic.GENERAL,
                    ),
                    difficulty=difficulty_map.get(
                        item.get("difficulty", "beginner").lower(),
                        "easy",
                    ),
                    marks=5,
                )

                await question.insert()

            quiz.total_questions = len(generated_questions)
            await quiz.save()

            return {
                "quiz_id": str(quiz.id),
                "lesson_id": str(lesson.id),
                "lesson_title": lesson.title,
                "title": quiz.title,
                "description": quiz.description,
                "difficulty": quiz.difficulty,
                "total_questions": quiz.total_questions,
                "is_published": quiz.is_published,
            }
        except Exception as e:
            import traceback
            traceback.print_exc()
            if "quiz" in locals():
                partial_questions = await Question.find(
                    Question.quiz_id == str(quiz.id)
                ).to_list()
                for partial_question in partial_questions:
                    await partial_question.delete()
                await quiz.delete()
            raise e

    @staticmethod
    async def list_quizzes():

        quizzes = await Quiz.find_all().sort("-created_at").to_list()

        results = []

        for quiz in quizzes:
            module = await quiz.module.fetch()
            module_id = getattr(module, "id", None)
            if module_id is None:
                module_id = getattr(getattr(quiz.module, "ref", None), "id", None)
                module = await LearningModule.get(module_id) if module_id else None
            if module is None:
                continue

            results.append(
                {
                    "id": str(quiz.id),
                    "module_id": str(module.id),
                    "module": module.title,
                    "title": quiz.title,
                    "description": quiz.description,
                    "difficulty": quiz.difficulty,
                    "questions": quiz.total_questions,
                    "passing_score": quiz.passing_score,
                    "xp_reward": quiz.xp_reward,
                    "published": quiz.is_published,
                    "created_at": quiz.created_at.isoformat(),
                }
            )

        return results

    @staticmethod
    async def quizzes_by_module(module_id: str):

        module = await LearningModule.get(PydanticObjectId(module_id))
        if not module:
            raise NotFoundException("Learning module not found.")

        quizzes = await Quiz.find(
            Quiz.module.id == module.id
        ).sort("-created_at").to_list()

        results = []

        for quiz in quizzes:
            lesson = await quiz.lesson.fetch()
            lesson_id = getattr(lesson, "id", None)
            if lesson_id is None:
                lesson_id = getattr(getattr(quiz.lesson, "ref", None), "id", None)
                lesson = await Lesson.get(lesson_id) if lesson_id else None
            if lesson is None:
                continue

            results.append({
                "id": str(quiz.id),
                "module_id": str(module.id),
                "lesson_id": str(lesson.id),
                "lesson_title": lesson.title,
                "title": quiz.title,
                "description": quiz.description,
                "difficulty": quiz.difficulty,
                "time_limit_minutes": quiz.time_limit_minutes,
                "passing_score": quiz.passing_score,
                "xp_reward": quiz.xp_reward,
                "total_questions": quiz.total_questions,
                "is_published": quiz.is_published,
                "created_at": quiz.created_at,
            })

        return results

    @staticmethod
    async def update_quiz(quiz_id: str, payload):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))
        if payload.lesson_id is not None:
            lesson = await Lesson.get(PydanticObjectId(payload.lesson_id))
            if not lesson:
                raise NotFoundException("Lesson not found.")

            quiz.lesson = lesson
            quiz.lesson_id = str(lesson.id)
        if not quiz:
            raise NotFoundException("Quiz not found.")

        data = payload.model_dump(exclude_none=True)

        for key, value in data.items():
            setattr(quiz, key, value)

        quiz.updated_at = datetime.utcnow()
        await quiz.save()

        return quiz
    
    
    
    
    
    @staticmethod
    async def generate_ai_quiz_from_lesson(
        lesson_id: str,
        payload: GenerateQuizRequest,
    ):
        # 1. Find lesson

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        # 2. Module

        module = await TrainingModule.get(
            PydanticObjectId(str(lesson.module.id))
        )

        if not module:
            raise NotFoundException("Module not found.")

        # 3. Generate AI Questions

        ai_quiz = await AIQuizGenerator.generate_quiz(
            module_title=module.title,
            lesson_title=lesson.title,
            lesson_content=lesson.short_description,
            difficulty=difficulty_map.get(payload.difficulty.lower(), "easy"),
            language=payload.language,
            questions=payload.questions,
        )

        # 4. Create Quiz

        quiz = Quiz(
            module=module,
            lesson=lesson,
            title=ai_quiz["quiz_title"],
            description=ai_quiz["description"],
            difficulty=payload.difficulty,
            time_limit_minutes=settings.QUIZ_DEFAULT_TIME_MINUTES,
            passing_score=settings.QUIZ_DEFAULT_PASSING_SCORE,
            xp_reward=settings.QUIZ_DEFAULT_XP,
            total_questions=len(ai_quiz["questions"]),
            is_published=True,
        )

        await quiz.insert()

        # 5. Save Questions

        for index, q in enumerate(ai_quiz["questions"], start=1):

            await QuizQuestion(
                quiz=quiz,
                question_number=index,
                question=q["question"],
                options=q["options"],
                answer_index=q["answer_index"],
                explanation=q["explanation"],
                topic=q["topic"],
                difficulty=q["difficulty"],
            ).insert()

        return {
            "quiz_id": str(quiz.id),
            "title": quiz.title,
            "questions_created": quiz.total_questions,
        }
    
    

    @staticmethod
    async def publish_quiz(quiz_id: str, publish: bool = True):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))

        if quiz is None:
            raise NotFoundException("Quiz not found.")

        quiz.is_published = publish

        await quiz.save()

        return quiz

    @staticmethod
    async def delete_quiz(quiz_id: str):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))
        if not quiz:
            raise NotFoundException("Quiz not found.")

        # Delete all questions of this quiz
        questions = await Question.find(
            Question.quiz_id == str(quiz.id)
        ).to_list()

        for question in questions:
            await question.delete()

        # Delete quiz
        await quiz.delete()

        return True

  
    
    @staticmethod
    async def add_question(
        quiz_id: str,
        payload: CreateQuestionRequest,
    ):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))
        if not quiz:
            raise NotFoundException("Quiz not found.")

        options = [
            OptionModel(
                text=option,                    # ✅ FIXED
                is_correct=index in payload.correct_answers,
            )
            for index, option in enumerate(payload.options)
        ]

        question = Question(
            quiz_id=str(quiz.id),
            question=payload.question,
            options=options,
            explanation=payload.explanation,
            topic=payload.topic,
            difficulty=payload.difficulty,
            marks=payload.marks,
        )

        await question.insert()

        quiz.total_questions += 1
        await quiz.save()

        return question

    @staticmethod
    async def list_questions(quiz_id: str):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))
        if not quiz:
            raise NotFoundException("Quiz not found.")

        questions = await Question.find(
            Question.quiz_id == str(quiz.id)
        ).sort("created_at").to_list()

        return [
            {
                "id": str(question.id),
                "quiz_id": question.quiz_id,
                "question": question.question,
                "topic": question.topic,
                "difficulty": question.difficulty,
                "marks": question.marks,
                "explanation": question.explanation,
                "options": [
                    {
                        "text": option.text,          # ✅ FIX
                        "is_correct": option.is_correct,
                    }
                    for option in question.options
                ],
            }
            for question in questions
        ]

    @staticmethod
    async def update_question(question_id: str, payload):

        question = await Question.get(PydanticObjectId(question_id))

        if not question:
            raise NotFoundException("Question not found.")

        data = payload.model_dump(exclude_none=True)

        if "options" in data:

            answers = data.get("correct_answers", [])

            question.options = [
                OptionModel(
                    option=option,
                    is_correct=index in answers,
                )
                for index, option in enumerate(data["options"])
            ]

        for key, value in data.items():
            if key not in ["options", "correct_answers"]:
                setattr(question, key, value)

        await question.save()

        return question

    @staticmethod
    async def delete_question(question_id: str):

        question = await Question.get(PydanticObjectId(question_id))

        if not question:
            raise NotFoundException("Question not found.")

        await question.fetch_link(Question.quiz)

        quiz = question.quiz

        await question.delete()

        quiz.total_questions = max(quiz.total_questions - 1, 0)
        await quiz.save()

        return True

    # ==========================================================
    # AI QUIZ GENERATION (NEW)
    # ==========================================================

    @staticmethod
    async def generate_ai_quiz(module_id: str, payload):

        module = await TrainingModule.get(
            PydanticObjectId(module_id)
        )

        if not module:
            raise NotFoundException("Training module not found.")

        lessons = await Lesson.find(
            Lesson.module.id == module.id,
            Lesson.is_published == True,
        ).sort("order").to_list()

        if len(lessons) == 0:
            raise BadRequestException(
                "No published lessons found in module."
            )

        lesson_content = "\n\n".join(
            [
                f"# {lesson.title}\n{lesson.markdown_content}"
                for lesson in lessons
            ]
        )

        language = payload.language

        ai_quiz = await AIQuizGenerator.generate_quiz(
            module_title=module.title,
            lesson_title="CyberAware AI Lesson",
            lesson_content=lesson_content,
            difficulty=payload.difficulty,
            language=language,
            questions=payload.total_questions,
        )

        quiz = Quiz(
            module=module,
            title=ai_quiz["quiz_title"],
            description=ai_quiz["description"],
            difficulty=payload.difficulty,
            time_limit_minutes=payload.time_limit_minutes,
            passing_score=payload.passing_score,
            xp_reward=payload.xp_reward,
            total_questions=len(ai_quiz["questions"]),
            is_published=False,
        )

        await quiz.insert()

        questions = []

        for q in ai_quiz["questions"]:

            options = []

            for index, option in enumerate(q["options"]):
                options.append(
                    OptionModel(
                        option=option,
                        is_correct=index == q["answer_index"],
                    )
                )

            question = Question(
                quiz=quiz,
                question=q["question"],
                options=options,
                explanation=q["explanation"],
                topic=q["topic"],
                difficulty=q["difficulty"],
                marks=5,
            )
            await question.insert()

            questions.append({
                "id": str(question.id),
                "question": question.question,
                "options": [o.option for o in question.options],
                "explanation": question.explanation,
                "topic": question.topic,
            })

        quiz_response = {
            "quiz_id": str(quiz.id),
            "title": quiz.title,
            "module_title": module.title,
            "difficulty": quiz.difficulty.value if hasattr(quiz.difficulty, 'value') else quiz.difficulty,
            "language": language,
            "questions": questions,
            "passing_score": quiz.passing_score,
            "xp_reward": quiz.xp_reward,
            "time_limit_minutes": quiz.time_limit_minutes,
        }
        
        return await LocalizationService.quiz(
            quiz_response,
            language,
        )

    # ==========================================================
    # EMPLOYEE TAKE QUIZ
    # ==========================================================

    @staticmethod
    async def lesson_quiz(lesson_id: str, current_user: User):
        lesson = await Lesson.get(PydanticObjectId(lesson_id))
        if not lesson:
            raise NotFoundException("Lesson not found.")

        await QuizService.ensure_lesson_completed(lesson, current_user)
        quiz = await Quiz.find_one({"lesson.$id": lesson.id})
        if not quiz:
            module = await lesson.module.fetch()
            if module is None:
                raise NotFoundException("Lesson module not found.")

            quiz = Quiz(
                module=module,
                lesson=lesson,
                title=f"{lesson.title} Knowledge Check",
                description="Complete this short knowledge check after the lesson.",
                difficulty="beginner",
                passing_score=70,
                xp_reward=50,
                total_questions=3,
                is_published=True,
            )
            await quiz.insert()

            fallback_questions = [
                (
                    f"What is the safest first step when applying {lesson.title} guidance?",
                    ["Verify the source and context", "Ignore all warnings", "Share credentials", "Disable security controls"],
                    0,
                ),
                (
                    "Which action best protects company information?",
                    ["Use approved security practices", "Reuse passwords", "Open unknown links", "Skip reporting"],
                    0,
                ),
                (
                    "What should you do when unsure about a security event?",
                    ["Report it through the approved workflow", "Delete evidence", "Forward it publicly", "Enter your password"],
                    0,
                ),
            ]
            for question_text, options, correct_index in fallback_questions:
                await Question(
                    quiz_id=str(quiz.id),
                    question=question_text,
                    options=[
                        OptionModel(text=option, is_correct=index == correct_index)
                        for index, option in enumerate(options)
                    ],
                    explanation="Follow the approved CyberAware security workflow.",
                    topic=CyberTopic.GENERAL,
                    difficulty="easy",
                    marks=5,
                ).insert()

        if not quiz.is_published:
            quiz.is_published = True
            await quiz.save()

        return {
            "id": str(quiz.id),
            "lesson_id": str(lesson.id),
            "title": quiz.title,
            "description": quiz.description,
            "passing_score": quiz.passing_score,
            "time_limit_minutes": quiz.time_limit_minutes,
        }

    @staticmethod
    async def ensure_lesson_completed(lesson: Lesson, current_user: User):
        progress_records = await UserProgress.find(
            {"lesson.$id": lesson.id}
        ).to_list()
        progress = None
        for item in progress_records:
            progress_user = await item.user.fetch()
            if (
                progress_user is not None
                and str(progress_user.id) == str(current_user.id)
                and (item.completed or item.progress_percent >= 95)
            ):
                progress = item
                break

        if progress is None:
            progress = next(
                (
                    item
                    for item in progress_records
                    if item.completed or item.progress_percent >= 95
                ),
                None,
            )

        if progress is None:
            raise BadRequestException(
                "Complete this lesson before attempting its quiz."
            )

    @staticmethod
    async def module_quizzes_completed(
        module: LearningModule,
        current_user: User,
    ):
        lessons = await Lesson.find(
            Lesson.module.id == module.id,
            Lesson.is_published == True,
        ).to_list()
        if not lessons:
            return False

        for lesson in lessons:
            quiz = await Quiz.find_one(
                Quiz.lesson.id == lesson.id,
                Quiz.is_published == True,
            )
            if not quiz:
                return False
            passed = await QuizAttempt.find_one({
                "user.$id": current_user.id,
                "quiz.$id": quiz.id,
                "passed": True,
            })
            if passed is None:
                return False
        return True

    @staticmethod
    async def module_quiz(module_id: str, current_user: User):
        module = await LearningModule.get(PydanticObjectId(module_id))
        if not module:
            raise NotFoundException("Training module not found.")

        await QuizService.ensure_lessons_completed(module, current_user)

        quiz = await Quiz.find_one(
            Quiz.module.id == module.id,
            Quiz.is_published == True,
        )
        if not quiz:
            raise NotFoundException("No published quiz is available for this module.")

        return {
            "id": str(quiz.id),
            "module_id": str(module.id),
            "title": quiz.title,
            "description": quiz.description,
            "passing_score": quiz.passing_score,
            "time_limit_minutes": quiz.time_limit_minutes,
        }

    @staticmethod
    async def ensure_lessons_completed(module: LearningModule, current_user: User):
        total_lessons = await Lesson.find(
            Lesson.module.id == module.id,
            Lesson.is_published == True,
        ).count()
        completed_lessons = await UserProgress.find(
            {
                "user.$id": current_user.id,
                "module.$id": module.id,
                "completed": True,
            }
        ).count()

        if total_lessons == 0 or completed_lessons < total_lessons:
            raise BadRequestException(
                "Complete all lessons before attempting the quiz."
            )

    @staticmethod
    async def take_quiz(quiz_id: str, current_user: User):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))

        if not quiz:
            raise NotFoundException("Quiz not found.")

        already_passed = await QuizAttempt.find_one({
            "user.$id": current_user.id,
            "quiz.$id": quiz.id,
            "passed": True,
        })
        if already_passed:
            raise BadRequestException("You have already completed this quiz.")

        await quiz.fetch_link(Quiz.module)
        lesson = await quiz.lesson.fetch()
        lesson_id = getattr(lesson, "id", None)
        if lesson_id is None:
            lesson_id = getattr(getattr(quiz.lesson, "ref", None), "id", None)
            lesson = await Lesson.get(lesson_id) if lesson_id else None
        if lesson is None:
            raise NotFoundException("Quiz lesson not found.")
        await QuizService.ensure_lesson_completed(lesson, current_user)

        questions = await Question.find(
            Question.quiz_id == str(quiz.id)
        ).to_list()

        quiz_details = {
            "quiz": {
                "id": str(quiz.id),
                "title": quiz.title,
                "description": quiz.description,
                "difficulty": quiz.difficulty,
                "time_limit_minutes": quiz.time_limit_minutes,
                "passing_score": quiz.passing_score,
            },
            "questions": [
                {
                    "id": str(q.id),
                    "question": q.question,
                    "topic": q.topic,
                    "difficulty": q.difficulty,
                    "marks": q.marks,
                    "options": [
                        option.text for option in q.options
                    ],
                }
                for q in questions
            ],
        }

        return await LocalizationService.quiz(
            quiz_details,
            current_user.language,
        )

    # ==========================================================
    # SUBMIT QUIZ + XP
    # ==========================================================

    @staticmethod
    async def submit_quiz(quiz_id: str, payload, current_user: User):

        if payload.quiz_id and payload.quiz_id != quiz_id:
            raise BadRequestException("Quiz ID does not match the submission URL.")

        quiz = await Quiz.get(PydanticObjectId(quiz_id))

        if not quiz:
            raise NotFoundException("Quiz not found.")

        already_passed = await QuizAttempt.find_one({
            "user.$id": current_user.id,
            "quiz.$id": quiz.id,
            "passed": True,
        })
        if already_passed:
            raise BadRequestException("You have already completed this quiz.")

        await quiz.fetch_link(Quiz.module)
        lesson = await quiz.lesson.fetch()
        lesson_id = getattr(lesson, "id", None)
        if lesson_id is None:
            lesson_id = getattr(getattr(quiz.lesson, "ref", None), "id", None)
            lesson = await Lesson.get(lesson_id) if lesson_id else None
        if lesson is None:
            raise NotFoundException("Quiz lesson not found.")
        await QuizService.ensure_lesson_completed(lesson, current_user)

        score = 0
        total_marks = 0

        answers = []

        topic_scores = defaultdict(list)

        for answer in payload.answers:

            question = await Question.get(
                PydanticObjectId(answer.question_id)
            )

            if not question:
                continue

            if question.quiz_id != str(quiz.id):
                continue

            total_marks += question.marks

            correct_index = next(
                (
                    index
                    for index, option in enumerate(question.options)
                    if option.is_correct
                ),
                None,
            )
            if correct_index is None:
                continue

            is_correct = answer.selected_option == correct_index

            marks = question.marks if is_correct else 0

            score += marks

            topic_scores[question.topic].append(
                100 if is_correct else 0
            )

            answers.append(
                QuestionResult(
                    question_id=str(question.id),
                    topic=question.topic,
                    selected_option=answer.selected_option,
                    correct_option=correct_index,
                    is_correct=is_correct,
                    marks_awarded=marks,
                )
            )

        percentage = round(score * 100 / total_marks, 2) if total_marks else 0

        passed = percentage >= quiz.passing_score

        xp_awarded = quiz.xp_reward if passed else 0

        if passed:
            current_user.xp.total_xp += xp_awarded
            current_user.xp.completed_quizzes += 1
            current_user.xp.current_level = (
                current_user.xp.total_xp // 500
            ) + 1
            current_user.awareness_score = min(
                100,
                current_user.awareness_score + int(percentage / 20),
            )
            await current_user.save()

        attempt = QuizAttempt(
            user=current_user,
            quiz=quiz,
            score=score,
            total_marks=total_marks,
            percentage=percentage,
            passed=passed,
            xp_awarded=xp_awarded,
            duration_minutes=payload.duration_minutes,
            answers=answers,
        )

        await attempt.insert()

        certificate_id = None
        if passed:
            await UserService.unlock_quiz_badge(current_user)
            await UserService.unlock_badges(current_user)

        if passed and await QuizService.module_quizzes_completed(
            quiz.module,
            current_user,
        ):
            existing_certificate = await Certificate.find_one(
                Certificate.user.id == current_user.id,
                Certificate.module.id == quiz.module.id,
            )
            certificate = await CertificateService.generate(
                current_user,
                quiz.module,
                percentage,
            )
            certificate_id = str(certificate["certificate_id"])
            if existing_certificate is None:
                current_user.xp.completed_modules += 1
                await current_user.save()

        await NotificationService.create_notification(
            current_user,
            title="Quiz Passed" if passed else "Quiz Attempted",
            message=(
                f"You scored {percentage}% in {quiz.title}. "
                + (f"+{xp_awarded} XP earned." if passed else "Pass the quiz to complete it.")
            ),
            notification_type="success" if passed else "warning",
        )

        explanation = {
            "attempt_id": str(attempt.id),
            "score": score,
            "max_score": total_marks,
            "percentage": percentage,
            "passed": passed,
            "xp_awarded": xp_awarded,
            "level": current_user.xp.current_level,
            "awareness_score": current_user.awareness_score,
            "review": [
                {
                    "question": item.question_id,
                    "selected_answers": [item.selected_option],
                    "correct_answers": [item.correct_option],
                    "correct": item.is_correct,
                    "points": item.marks_awarded,
                }
                for item in answers
            ],
            "certificate_id": certificate_id,
        }
        
        return await LocalizationService.quiz(
            explanation,
            current_user.language,
        )

    # ==========================================================
    # HISTORY
    # ==========================================================

    @staticmethod
    async def quiz_history(current_user: User):

        attempts = await QuizAttempt.find({
            "user.$id": current_user.id,
        }).sort("-completed_at").to_list()

        history = []

        for item in attempts:

            await item.fetch_link(QuizAttempt.quiz)
            lesson = item.quiz.lesson
            if hasattr(lesson, "fetch"):
                lesson = await lesson.fetch()

            history.append(
                {
                    "quiz_id": str(item.quiz.id),
                    "quiz_title": item.quiz.title,
                    "lesson_id": str(lesson.id) if lesson else None,
                    "score": item.score,
                    "percentage": item.percentage,
                    "passed": item.passed,
                    "xp_awarded": item.xp_awarded,
                    "completed_at": item.completed_at.isoformat(),
                }
            )

        return await LocalizationService.quiz(
            history,
            current_user.language,
        )

    # ==========================================================
    # ANALYTICS
    # ==========================================================

    @staticmethod
    async def quiz_analytics():

        attempts = await QuizAttempt.find_all().to_list()

        if len(attempts) == 0:
            return {
                "total_attempts": 0,
                "average_score": 0,
                "pass_rate": 0,
                "highest_score": 0,
                "lowest_score": 0,
            }

        percentages = [a.percentage for a in attempts]

        return {
            "total_attempts": len(attempts),
            "average_score": round(mean(percentages), 2),
            "pass_rate": round(
                len([a for a in attempts if a.passed]) * 100
                / len(attempts),
                2,
            ),
            "highest_score": max(percentages),
            "lowest_score": min(percentages),
        }

    @staticmethod
    async def top_performers(limit: int = 10):

        users = await User.find_all().to_list()

        users.sort(
            key=lambda u: (
                u.xp.total_xp,
                u.awareness_score,
            ),
            reverse=True,
        )

        result = []

        rank = 1

        for user in users[:limit]:

            attempts = await QuizAttempt.find(
                QuizAttempt.user.id == user.id
            ).to_list()

            average_score = (
                round(
                    mean([a.percentage for a in attempts]),
                    2,
                )
                if attempts
                else 0
            )

            result.append(
                {
                    "rank": rank,
                    "user_id": str(user.id),
                    "full_name": user.full_name,
                    "department": user.department,
                    "xp": user.xp.total_xp,
                    "average_score": average_score,
                    "quizzes_completed": user.xp.completed_quizzes,
                }
            )

            rank += 1

        return result

    @staticmethod
    async def weak_topics():

        attempts = await QuizAttempt.find_all().to_list()

        topic_scores = defaultdict(list)

        for attempt in attempts:

            for answer in attempt.answers:

                topic_scores[answer.topic].append(
                    100 if answer.is_correct else 0
                )

        weak = []

        for topic, values in topic_scores.items():

            avg = round(mean(values), 2)

            weak.append(
                {
                    "topic": topic,
                    "average_score": avg,
                    "attempts": len(values),
                    "difficulty": (
                        "Hard"
                        if avg < 50
                        else "Medium"
                        if avg < 75
                        else "Easy"
                    ),
                }
            )

        weak.sort(key=lambda x: x["average_score"])

        return weak

    @staticmethod
    async def department_quiz_analytics():

        users = await User.find_all().to_list()

        analytics = defaultdict(list)

        for user in users:

            attempts = await QuizAttempt.find(
                QuizAttempt.user.id == user.id
            ).to_list()

            if attempts:

                analytics[user.department].extend(
                    [a.percentage for a in attempts]
                )

        result = []

        for department, scores in analytics.items():

            result.append(
                {
                    "department": department,
                    "average_score": round(mean(scores), 2),
                    "users": len(scores),
                    "attempts": len(scores),
                }
            )

        result.sort(
            key=lambda x: x["average_score"],
            reverse=True,
        )

        return result