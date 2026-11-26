"""
============================================================
CyberAware Debug Script
Checks all lessons linked to a learning module.
============================================================
Run:
    python debug_lessons.py
============================================================
"""

import asyncio
from beanie import PydanticObjectId

from app.database.mongodb.connection import connect_to_mongo
from app.models.lesson import Lesson
from app.models.module import LearningModule

# -----------------------------------------------------------
# CHANGE THIS MODULE ID IF YOU WANT TO TEST ANOTHER COURSE
# -----------------------------------------------------------

MODULE_ID = "6aac0c185ad2f1736bda9d6b"


async def main():
    print("\nConnecting to MongoDB...\n")

    # Connect using your existing MongoDB connection
    await connect_to_mongo()

    print("MongoDB Connected Successfully\n")

    # -------------------------------------------------------
    # Check Module
    # -------------------------------------------------------

    module = await LearningModule.get(PydanticObjectId(MODULE_ID))

    if not module:
        print("Module not found!")
        return

    print("=" * 70)
    print("MODULE DETAILS")
    print("=" * 70)

    print(f"Module ID        : {module.id}")
    print(f"Title            : {module.title}")
    print(f"Category         : {module.category}")
    print(f"Difficulty       : {module.difficulty}")
    print(f"Published        : {module.is_published}")
    print(f"Module Count     : {module.total_lessons}")

    print("\nSearching lessons...\n")

    # -------------------------------------------------------
    # Fetch lessons linked to this module
    # -------------------------------------------------------

    lessons = await Lesson.find(
        Lesson.module == module.id
    ).sort("order").to_list()

    print("=" * 70)
    print(f"TOTAL LESSONS FOUND IN DATABASE : {len(lessons)}")
    print("=" * 70)

    if len(lessons) == 0:
        print("No lessons are linked to this module.")
        print("This is why Employee Course Details shows 'No Lessons Available'.")
        return

    # -------------------------------------------------------
    # Print lesson information
    # -------------------------------------------------------

    for index, lesson in enumerate(lessons, start=1):
        print(f"\nLesson {index}")
        print("-" * 40)

        print(f"Lesson ID        : {lesson.id}")
        print(f"Title            : {lesson.title}")
        print(f"Order            : {lesson.order}")
        print(f"Published        : {lesson.is_published}")
        print(f"XP Reward        : {lesson.xp_reward}")
        print(f"Estimated Minutes: {lesson.estimated_minutes}")
        print(f"Module Reference : {lesson.module}")

    print("\n" + "=" * 70)
    print("DEBUG COMPLETED SUCCESSFULLY")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())