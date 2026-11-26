import re
from googleapiclient.discovery import build

from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.lesson import Lesson
from beanie import PydanticObjectId


class YouTubeService:

    @staticmethod
    def extract_video_id(url: str):
        pattern = r"(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([\w-]{11})"
        match = re.search(pattern, url)

        if not match:
            raise BadRequestException("Invalid YouTube URL.")

        return match.group(1)

    @staticmethod
    async def sync_lesson_video(lesson_id: str, url: str):
        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if lesson is None:
            raise NotFoundException("Lesson not found.")

        youtube = build(
            "youtube",
            "v3",
            developerKey=settings.YOUTUBE_API_KEY,
        )

        video_id = YouTubeService.extract_video_id(url)

        response = (
            youtube.videos()
            .list(
                part="snippet,contentDetails",
                id=video_id,
            )
            .execute()
        )

        if len(response["items"]) == 0:
            raise NotFoundException("Video not found.")

        snippet = response["items"][0]["snippet"]

        lesson.content.video_url = f"https://www.youtube.com/watch?v={video_id}"
        lesson.content.cover_image = snippet["thumbnails"]["high"]["url"]

        await lesson.save()

        return {
            "video_url": lesson.content.video_url,
            "thumbnail": lesson.content.cover_image,
            "title": snippet["title"],
            "description": snippet["description"],
        }