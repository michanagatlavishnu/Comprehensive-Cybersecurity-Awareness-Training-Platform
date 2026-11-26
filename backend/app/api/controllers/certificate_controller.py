from fastapi.responses import Response

from app.dependencies.auth import CurrentUser
from app.services.certificate_service import CertificateService
from app.utils.response.api_response import success_response


class CertificateController:
    @staticmethod
    async def download_sample(current_user: CurrentUser):
        pdf = await CertificateService.sample_pdf(current_user)
        return Response(
            content=pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="cyberaware-certificate-preview.pdf"',
            },
        )

    @staticmethod
    async def list_certificates(current_user: CurrentUser):
        return success_response(
            message="Certificates fetched successfully.",
            data=await CertificateService.list_for_user(current_user),
        )

    @staticmethod
    async def download_certificate(
        certificate_id: str,
        current_user: CurrentUser,
    ):
        pdf = await CertificateService.pdf(certificate_id, current_user)
        return Response(
            content=pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="certificate-{certificate_id}.pdf"',
            },
        )