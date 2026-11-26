import asyncio

from app.core.config import settings
from app.services.phishing_scheduler_service import (
    PhishingSchedulerService,
)

_scheduler_running = False


async def phishing_scheduler_loop():
    global _scheduler_running

    if _scheduler_running:
        return

    _scheduler_running = True

    while True:

        try:
            await PhishingSchedulerService.run_scheduler()

        except Exception as exc:
            print("Scheduler Error:", exc)

        await asyncio.sleep(
            settings.PHISHING_SCHEDULER_INTERVAL_SECONDS
        )