import uuid
from io import BytesIO

from beanie import PydanticObjectId
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas

from app.models.certificate import Certificate
from app.models.training import TrainingModule
from app.models.user import User
from app.core.exceptions import NotFoundException
from app.services.localization_service import LocalizationService


class CertificateService:

    @staticmethod
    async def sample_pdf(current_user: User):
        output = BytesIO()
        document = canvas.Canvas(output, pagesize=letter)
        width, height = letter
        document.setTitle("CyberAware Training Certificate")
        document.setFont("Helvetica-Bold", 24)
        document.drawCentredString(width / 2, height - 150, "CyberAware Training Certificate")
        document.setFont("Helvetica", 14)
        document.drawCentredString(width / 2, height - 220, "This certifies that")
        document.setFont("Helvetica-Bold", 20)
        document.drawCentredString(width / 2, height - 270, current_user.full_name)
        document.setFont("Helvetica", 14)
        document.drawCentredString(width / 2, height - 330, "completed CyberAware employee training")
        document.setFont("Helvetica", 11)
        document.drawCentredString(width / 2, height - 390, "Certificate preview")
        document.save()
        output.seek(0)
        return output.read()

    @staticmethod
    async def list_for_user(current_user: User):
        certificates = await Certificate.find(
            Certificate.user.id == current_user.id
        ).sort("-issued_at").to_list()

        result = []
        for certificate in certificates:
            await certificate.fetch_link(Certificate.module)
            result.append({
                "id": str(certificate.id),
                "course_name": certificate.module.title,
                "certificate_number": certificate.certificate_number,
                "issued_on": certificate.issued_at.isoformat(),
                "score": certificate.score,
                "issued": True,
            })
        return result

    @staticmethod
    async def pdf(certificate_id: str, current_user: User):
        certificate = await Certificate.get(PydanticObjectId(certificate_id))
        if not certificate:
            raise NotFoundException("Certificate not found.")

        owner = await certificate.user.fetch()
        module = await certificate.module.fetch()
        if owner is None or str(owner.id) != str(current_user.id) or module is None:
            raise NotFoundException("Certificate not found.")

        output = BytesIO()
        document = canvas.Canvas(output, pagesize=letter)
        width, height = letter
        document.setTitle(f"CyberAware Certificate - {certificate.certificate_number}")
        document.setFillColor(colors.HexColor("#F7FAFC"))
        document.rect(0, 0, width, height, fill=1, stroke=0)
        document.setStrokeColor(colors.HexColor("#0F766E"))
        document.setLineWidth(3)
        document.roundRect(28, 28, width - 56, height - 56, 14, fill=0, stroke=1)
        document.setStrokeColor(colors.HexColor("#D4AF37"))
        document.setLineWidth(1)
        document.roundRect(38, 38, width - 76, height - 76, 10, fill=0, stroke=1)

        document.setFillColor(colors.HexColor("#0F766E"))
        document.rect(40, height - 132, width - 80, 92, fill=1, stroke=0)
        document.setFillColor(colors.HexColor("#D4AF37"))
        document.circle(width / 2, height - 86, 24, fill=0, stroke=1)
        document.setFillColor(colors.white)
        document.setFont("Helvetica-Bold", 25)
        document.drawCentredString(width / 2, height - 94, "CA")

        document.setFillColor(colors.HexColor("#12343B"))
        document.setFont("Helvetica-Bold", 25)
        document.drawCentredString(width / 2, height - 180, "CERTIFICATE OF COMPLETION")
        document.setFont("Helvetica", 13)
        document.setFillColor(colors.HexColor("#52666B"))
        document.drawCentredString(width / 2, height - 215, "This certifies that")
        document.setFillColor(colors.HexColor("#12343B"))
        document.setFont("Helvetica-Bold", 27)
        document.drawCentredString(width / 2, height - 260, current_user.full_name)
        document.setStrokeColor(colors.HexColor("#D4AF37"))
        document.line(150, height - 275, width - 150, height - 275)
        document.setFillColor(colors.HexColor("#52666B"))
        document.setFont("Helvetica", 13)
        document.drawCentredString(width / 2, height - 315, "has successfully completed the CyberAware training module")

        document.setFillColor(colors.HexColor("#0F766E"))
        document.roundRect(95, height - 425, width - 190, 76, 8, fill=1, stroke=0)
        document.setFillColor(colors.white)
        document.setFont("Helvetica-Bold", 18)
        title_lines = simpleSplit(module.title, "Helvetica-Bold", 18, width - 230)
        title_y = height - 385 + (len(title_lines) - 1) * 10
        for line in title_lines[:2]:
            document.drawCentredString(width / 2, title_y, line)
            title_y -= 22

        document.setFillColor(colors.HexColor("#12343B"))
        document.setFont("Helvetica-Bold", 16)
        document.drawCentredString(width / 2, height - 475, f"Final assessment score: {certificate.score}%")
        document.setFont("Helvetica", 11)
        document.setFillColor(colors.HexColor("#52666B"))
        document.drawCentredString(width / 2, height - 505, "Verified completion requires a passing assessment score.")

        document.setStrokeColor(colors.HexColor("#A9B8B8"))
        document.line(95, 112, 245, 112)
        document.line(width - 245, 112, width - 95, 112)
        document.setFillColor(colors.HexColor("#52666B"))
        document.setFont("Helvetica", 10)
        document.drawCentredString(170, 96, "CyberAware Training Team")
        document.drawCentredString(width - 170, 96, certificate.issued_at.strftime("%d %B %Y"))
        document.setFont("Helvetica-Bold", 9)
        document.drawCentredString(width / 2, 64, f"Certificate ID: {certificate.certificate_number}")
        document.setFont("Helvetica", 8)
        document.drawCentredString(width / 2, 50, "This certificate is issued electronically by CyberAware and can be verified by its certificate ID.")
        document.save()
        certificate.is_downloaded = True
        await certificate.save()
        output.seek(0)
        return output.read()

    @staticmethod
    async def generate(
        current_user: User,
        module: TrainingModule,
        score: float = 100,
    ):

        certificate = await Certificate.find_one(
            Certificate.user.id == current_user.id,
            Certificate.module.id == module.id,
        )

        if not certificate:
            certificate = Certificate(
                user=current_user,
                module=module,
                certificate_number=f"CYBER-{uuid.uuid4().hex[:10].upper()}",
                score=round(score),
            )
            await certificate.insert()
        elif score > certificate.score:
            certificate.score = round(score)
            await certificate.save()

        certificate_payload = {
            "certificate_id": str(certificate.id),
            "course": module.title,
            "recipient": current_user.full_name,
            "issued_on": certificate.issued_at.strftime("%d %B %Y"),
        }

        return await LocalizationService.lesson(
            certificate_payload,
            current_user.language,
        )