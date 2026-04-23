export type MissionStatus = "active" | "completed" | "blocked";

export type Mission = {
  _id: string;
  title: string;
  metric: string;
  targetValue: string;
  status: MissionStatus;
  weekStart: string;
};

export type Win = {
  _id: string;
  content: string;
  createdAt: number;
};

export type CalendarEvent = {
  _id: string;
  title: string;
  startAt: number;
  endAt: number;
  isClassEvent: boolean;
  teamId?: string;
};

export type LeaderboardRow = {
  teamId: string;
  teamName: string;
  points: number;
  breakdown: {
    missionCreated: number;
    missionCompleted: number;
    winPosted: number;
  };
};
