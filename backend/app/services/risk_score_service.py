from app.models.phishing_email import PhishingEmail


class RiskScoreService:

    @staticmethod
    async def employee_risk(user):

        emails = await PhishingEmail.find(
            PhishingEmail.user.id == user.id
        ).to_list()

        if not emails:
            return 0

        score = 0

        for email in emails:

            if email.clicked:
                score += 30

            if email.credentials_submitted:
                score += 40

            if email.reported:
                score -= 10

        score = max(0, min(score, 100))

        return score

    @staticmethod
    async def department_risk(users):

        values = []

        for user in users:
            values.append(
                await RiskScoreService.employee_risk(user)
            )

        if not values:
            return 0

        return round(sum(values) / len(values), 2)
    
    
    
    @staticmethod
    async def organization_heatmap():

        from app.models.user import User

        users = await User.find_all().to_list()

        departments = {}

        for user in users:

            departments.setdefault(user.department, [])

            departments[user.department].append(user)

        result = []

        for department, dept_users in departments.items():

            result.append(
                {
                    "department": department,
                    "risk": await RiskScoreService.department_risk(
                        dept_users
                    ),
                    "employees": len(dept_users),
                }
            )

        return result