import api from "../api";

class DashboardService {
  async getOverview() {
    const { data } = await api.get("/dashboard");
    const overview = data.data;
    const stats = overview.stats ?? {};

    return {
      ...overview,
      ...stats,
      total_xp: stats.total_xp ?? stats.xp ?? 0,
      current_level: stats.current_level ?? stats.level ?? 1,
      learning_streak: stats.learning_streak ?? 0,
    };
  }

  async getWeeklyActivity() {
    const { data } = await api.get("/dashboard/activity");
    return data.data;
  }

  async getLearningProgress() {
    const { data } = await api.get("/dashboard/progress");
    return data.data;
  }

  async getXPHistory() {
    const { data } = await api.get("/dashboard/xp-history");
    return data.data;
  }

  async getNotifications() {
    const { data } = await api.get("/notifications");
    return data.data;
  }
}

export default new DashboardService();