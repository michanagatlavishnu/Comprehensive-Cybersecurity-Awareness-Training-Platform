from app.core.ai.groq_client import GroqClient


class AIQuizGenerator:

    @staticmethod
    async def generate_quiz(
        module_title: str,
        lesson_title: str,
        lesson_content: str,
        difficulty: str = "beginner",
        language: str = "en",
        questions: int = 10,
    ):

        prompt = f"""
You are CyberAware AI.

Generate EXACTLY 20 cybersecurity multiple-choice questions from the lesson.

MODULE:
{module_title}

LESSON TITLE:
{lesson_title}

LESSON CONTENT:
{lesson_content}

Rules:

- Create exactly 20 questions.
- Every question must have exactly 4 options.
- Only ONE correct answer.
- answer_index must be 0,1,2,3.
- Explanation should teach the employee.
- Questions should cover the lesson only.
- Difficulty: {difficulty}
- Language: {language}

Return ONLY JSON.

{{
  "quiz_title":"{lesson_title} Quiz",
  "description":"Quiz generated from lesson content.",
  "questions":[
    {{
      "question":"...",
      "options":["A","B","C","D"],
      "answer_index":1,
      "topic":"Phishing",
      "difficulty":"{difficulty}",
      "explanation":"..."
    }}
  ]
}}
"""

        return await GroqClient.json_chat(
            [
                {
                    "role": "system",
                    "content": "Generate cybersecurity quizzes in JSON only.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )