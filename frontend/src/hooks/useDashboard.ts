import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboard/dashboardService";
import trainingService from "../services/trainingService";

export function useDashboard() {
  const overviewQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getOverview,
    staleTime: 300000,
  });

  const weeklyQuery = useQuery({
    queryKey: ["dashboard-weekly"],
    queryFn: dashboardService.getWeeklyActivity,
    staleTime: 300000,
  });

  const progressQuery = useQuery({
    queryKey: ["dashboard-progress"],
    queryFn: dashboardService.getLearningProgress,
    staleTime: 300000,
  });

  const notificationsQuery = useQuery({
    queryKey: ["dashboard-notifications"],
    queryFn: dashboardService.getNotifications,
    staleTime: 60000,
  });

  const coursesQuery = useQuery({
    queryKey: ["dashboard-courses"],
    queryFn: trainingService.getCourses,
    staleTime: 300000,
  });

  return {
    overview: overviewQuery.data,
    weeklyActivity: weeklyQuery.data || [],
    modules: coursesQuery.data || [],
    activities: overviewQuery.data?.recent_activity || [],
    progress: progressQuery.data,
    notifications: notificationsQuery.data || [],

    loading:
      overviewQuery.isLoading ||
      weeklyQuery.isLoading ||
      progressQuery.isLoading ||
      coursesQuery.isLoading,

    error:
      overviewQuery.error ||
      weeklyQuery.error ||
      progressQuery.error,
  };
}