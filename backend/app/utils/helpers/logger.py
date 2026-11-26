import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOG_FORMAT = (
    "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
)

logger = logging.getLogger("cyberaware")
logger.setLevel(logging.INFO)

if not logger.handlers:

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(LOG_FORMAT))

    file_handler = RotatingFileHandler(
        LOG_DIR / "cyberaware.log",
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT))

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)


def get_logger(name: str):
    return logger.getChild(name)