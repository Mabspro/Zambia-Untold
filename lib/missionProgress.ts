import { MISSIONS } from "@/lib/missions";
import type { MissionEventName } from "@/lib/missionEvents";
import type { MissionProgress } from "@/lib/museumPassport";

export function getInitialMissionProgress(): MissionProgress {
  return {
    completedSteps: [],
    completedMissions: [],
    earnedBadges: [],
    lastActiveMission: MISSIONS[0]?.id ?? "substrate",
  };
}

export function applyMissionEvent(
  progress: MissionProgress,
  event: MissionEventName
): {
  next: MissionProgress;
  newlyCompletedMissionId: string | null;
} {
  const step = MISSIONS.flatMap((mission) => mission.steps).find((candidate) => candidate.completionEvent === event);
  if (!step) {
    return { next: progress, newlyCompletedMissionId: null };
  }

  if (progress.completedSteps.includes(step.id)) {
    return { next: progress, newlyCompletedMissionId: null };
  }

  const completedSteps = [...progress.completedSteps, step.id];
  let completedMissions = [...progress.completedMissions];
  let earnedBadges = [...progress.earnedBadges];
  let newlyCompletedMissionId: string | null = null;

  for (const mission of MISSIONS) {
    const done = mission.steps.every((missionStep) => completedSteps.includes(missionStep.id));
    if (done && !completedMissions.includes(mission.id)) {
      completedMissions.push(mission.id);
      newlyCompletedMissionId = mission.id;
    }
    if (done && !earnedBadges.includes(mission.badgeLabel)) {
      earnedBadges.push(mission.badgeLabel);
    }
  }

  const nextActiveMission =
    MISSIONS.find((mission) => !completedMissions.includes(mission.id))?.id ?? progress.lastActiveMission;

  return {
    next: {
      completedSteps,
      completedMissions,
      earnedBadges,
      lastActiveMission: nextActiveMission,
    },
    newlyCompletedMissionId,
  };
}
