from fastapi import APIRouter

from app.api.controllers.certificate_controller import CertificateController

router = APIRouter(tags=["Certificates"])

router.get("/certificates/sample/download")(
    CertificateController.download_sample
)
router.get("/certificates")(CertificateController.list_certificates)
router.get("/certificates/{certificate_id}/download")(
    CertificateController.download_certificate
)