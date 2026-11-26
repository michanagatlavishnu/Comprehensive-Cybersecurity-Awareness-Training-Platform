import api from "../api";

/* ==========================================================
   CYBERAWARE ADMIN TRAINING MODULE SERVICE
========================================================== */

/* ---------- Backend Categories (Exact Enum Values) ---------- */

export type ModuleCategory =
  | "Phishing"
  | "Passwords"
  | "Email Security"
  | "Social Engineering"
  | "Network Security"
  | "Mobile Security"
  | "Cloud Security"
  | "AI Security"
  | "Incident Response";

export type ModuleDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

/* ==========================================================
   TYPES
========================================================== */

export interface TrainingModule {
  id: string;
  title: string;
  description: string;

  category: ModuleCategory;
  difficulty: ModuleDifficulty;

  thumbnail?: string;

  estimated_minutes: number;
  xp_reward: number;

  total_lessons: number;

  tags: string[];

  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateModulePayload {
  title: string;
  description: string;

  category: ModuleCategory;
  difficulty: ModuleDifficulty;

  thumbnail?: string;

  estimated_minutes: number;
  xp_reward: number;

  tags?: string[];

  is_published: boolean;
}

export interface UpdateModulePayload
  extends Partial<CreateModulePayload> {}

/* ==========================================================
   SERVICE
========================================================== */

class CourseService {
  /* ---------------- Employee ---------------- */

  async getModules(params?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<TrainingModule[]> {
    const response = await api.get("/modules", { params });

    return response.data.data.map((module: any) => ({
      ...module,
      estimated_minutes:
        module.duration_minutes ?? module.estimated_minutes ?? 30,
      total_lessons: module.total_lessons ?? 0,
      tags: module.tags ?? [],
    }));
  }

  async getModule(moduleId: string): Promise<TrainingModule> {
    const response = await api.get(`/modules/${moduleId}`);

    const module = response.data.data;

    return {
      ...module,
      estimated_minutes:
        module.duration_minutes ?? module.estimated_minutes ?? 30,
      total_lessons: module.total_lessons ?? 0,
      tags: module.tags ?? [],
    };
  }

  /* ---------------- Admin ---------------- */

  async createModule(
    payload: CreateModulePayload
  ): Promise<TrainingModule> {
    const body = {
      title: payload.title,
      description: payload.description,

      category: payload.category,
      difficulty: payload.difficulty,

      duration_minutes: Number(payload.estimated_minutes),
      xp_reward: Number(payload.xp_reward),

      thumbnail: payload.thumbnail || "",
      is_published: payload.is_published,
    };

    const response = await api.post("/admin/modules", body);

    const module = response.data.data;

    return {
      ...module,
      estimated_minutes:
        module.duration_minutes ?? module.estimated_minutes ?? 30,
      total_lessons: module.total_lessons ?? 0,
      tags: module.tags ?? [],
    };
  }

  async updateModule(
    moduleId: string,
    payload: UpdateModulePayload
  ): Promise<TrainingModule> {
    const body: any = {};

    if (payload.title !== undefined) body.title = payload.title;
    if (payload.description !== undefined)
      body.description = payload.description;
    if (payload.category !== undefined) body.category = payload.category;
    if (payload.difficulty !== undefined)
      body.difficulty = payload.difficulty;
    if (payload.thumbnail !== undefined) body.thumbnail = payload.thumbnail;
    if (payload.is_published !== undefined)
      body.is_published = payload.is_published;

    if (payload.estimated_minutes !== undefined) {
      body.duration_minutes = Number(payload.estimated_minutes);
    }

    if (payload.xp_reward !== undefined) {
      body.xp_reward = Number(payload.xp_reward);
    }

    const response = await api.put(`/admin/modules/${moduleId}`, body);

    const module = response.data.data;

    return {
      ...module,
      estimated_minutes:
        module.duration_minutes ?? module.estimated_minutes ?? 30,
      total_lessons: module.total_lessons ?? 0,
      tags: module.tags ?? [],
    };
  }

  async deleteModule(moduleId: string) {
    const response = await api.delete(`/admin/modules/${moduleId}`);
    return response.data;
  }

  async publishModule(moduleId: string) {
    return this.updateModule(moduleId, {
      is_published: true,
    });
  }

  async unpublishModule(moduleId: string) {
    return this.updateModule(moduleId, {
      is_published: false,
    });
  }

  async searchModules(search: string) {
    return this.getModules({ search });
  }

  async modulesByCategory(category: string) {
    return this.getModules({ category });
  }

  async modulesByDifficulty(difficulty: string) {
    return this.getModules({ difficulty });
  }
}

export default new CourseService();