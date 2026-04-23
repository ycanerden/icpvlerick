export type ScoreBreakdown = {
  missionCreated: number;
  missionCompleted: number;
  winPosted: number;
  total: number;
};

export function calculateScore({
  missionCount,
  completedCount,
  winsCount,
}: {
  missionCount: number;
  completedCount: number;
  winsCount: number;
}): ScoreBreakdown {
  const missionCreated = missionCount * 2;
  const missionCompleted = completedCount * 8;
  const winPosted = Math.min(winsCount, 3);
  return {
    missionCreated,
    missionCompleted,
    winPosted,
    total: missionCreated + missionCompleted + winPosted,
  };
}
