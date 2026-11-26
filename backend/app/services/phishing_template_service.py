from pathlib import Path

from app.core.config import settings


TEMPLATE_DIR = Path("app/templates/phishing")


class PhishingTemplateService:

    # ==========================================================
    # TEMPLATE LOADING
    # ==========================================================

    @staticmethod
    def load_template(template_name: str) -> str:
        """
        Load an HTML template from the phishing templates directory.
        """

        template_path = TEMPLATE_DIR / f"{template_name}.html"

        if template_path.exists():
            return template_path.read_text(encoding="utf-8")

        raise FileNotFoundError(
            f"{template_name}.html not found"
        )

    # ==========================================================
    # EMAIL TEMPLATE RENDERING
    # ==========================================================

    @staticmethod
    def render_template(
        template_name: str,
        tracking_link: str,
    ) -> str:
        """
        Load an email template and replace the tracking link.

        The HTML template should contain:

            {TRACKING_LINK}
        """

        html = PhishingTemplateService.load_template(
            template_name
        )

        return html.replace(
            "{TRACKING_LINK}",
            tracking_link,
        )

    # ==========================================================
    # CTA BUTTON
    # ==========================================================

    @staticmethod
    def button(
        url: str,
        text: str,
    ) -> str:
        """
        Generate a CTA button.
        """

        return f"""
<p style="text-align:center;">
<a href="{url}"
   style="
       display:inline-block;
       padding:14px 24px;
       background:#2563EB;
       color:white !important;
       border-radius:8px;
       text-decoration:none;
       font-weight:bold;
       margin-top:20px;
   ">
{text}
</a>
</p>
"""

    # ==========================================================
    # TRACKING PIXEL
    # ==========================================================

    @staticmethod
    def tracking_pixel(
        token: str,
    ) -> str:
        """
        Generate a 1x1 tracking pixel.
        """

        return (
            f'<img '
            f'src="{settings.PHISHING_BASE_URL}/api/v1/phishing/open/{token}" '
            f'width="1" '
            f'height="1" '
            f'style="display:none;" '
            f'alt="" />'
        )

    # ==========================================================
    # LANDING PAGE TEMPLATE RENDERING
    # ==========================================================

    @staticmethod
    def render_landing_page(
        template_name: str,
        token: str,
    ) -> str:
        """
        Load a landing-page template and replace the token.

        Example:

            template_name = "gmail"

        will load:

            app/templates/phishing/landing_gmail.html

        The HTML template should contain:

            {TOKEN}
        """

        html = PhishingTemplateService.load_template(
            f"landing_{template_name}"
        )

        return html.replace(
            "{TOKEN}",
            token,
        )

    # ==========================================================
    # LEGACY LANDING PAGE WRAPPER
    # ==========================================================

    @staticmethod
    def landing_page(
        title: str,
        body_html: str,
    ) -> str:
        """
        Generate a landing page directly.

        Kept for backwards compatibility. New templates should
        preferably use render_landing_page().
        """

        return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{title}</title>

<style>

body {{
background:#eef2f7;
font-family:Arial, Helvetica, sans-serif;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
margin:0;
}}

.card {{
background:white;
padding:40px;
border-radius:16px;
width:420px;
box-shadow:0 10px 30px rgba(0,0,0,.15);
}}

input {{
width:100%;
padding:12px;
margin:12px 0;
border:1px solid #CBD5E1;
border-radius:8px;
box-sizing:border-box;
}}

button {{
width:100%;
padding:12px;
background:#2563EB;
color:white;
border:none;
border-radius:8px;
font-weight:bold;
cursor:pointer;
}}

.logo {{
text-align:center;
font-size:24px;
font-weight:bold;
margin-bottom:20px;
}}

.warning {{
margin-top:20px;
font-size:12px;
color:#64748B;
text-align:center;
}}

</style>

</head>

<body>

<div class="card">

<div class="logo">
{title}
</div>

{body_html}

<div class="warning">
CyberAware Security Awareness Simulation
</div>

</div>

</body>
</html>
"""
