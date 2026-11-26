from app.core.ai.groq_client import GroqClient


class PhishingAIGenerator:

    @staticmethod
    async def generate_email(
        department: str,
        topic: str,
        template_name: str,
        language: str = "en",
        difficulty: str = "medium",
    ):

        prompt = f"""
You are an enterprise cybersecurity awareness trainer.

Generate a realistic phishing email.

Department: {department}
Topic: {topic}
Template Style: {template_name}
Difficulty: {difficulty}
Language: {language}

Return ONLY JSON.

JSON Format:
{{
  "subject":"",
  "sender_name":"",
  "sender_email":"",
  "html_body":""
}}

Requirements:
- Make it realistic.
- Use HTML formatting.
- Include a CTA button placeholder: {{TRACKING_LINK}}
- Do not include explanations.
"""

        result = await GroqClient.json_chat(
            [
                {
                    "role": "system",
                    "content": "You generate phishing simulation emails.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )

        return result

    # ==========================================================
    # AI LANDING PAGE
    # ==========================================================

    @staticmethod
    async def generate_landing_page(
        template_name: str,
        language: str = "en",
    ):

        prompt = f"""
Generate HTML BODY ONLY for a fake login page.

Brand Style:
{template_name}

Language:
{language}

Requirements:
- Responsive.
- Login Form.
- Email Field.
- Password Field.
- Submit Button.
- No JavaScript.
"""

        html = await GroqClient.chat(
            [
                {
                    "role": "system",
                    "content": "Generate phishing landing pages.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )

        return html