export type SimulationSpeed = "slow" | "normal" | "fast";

export type MissionPreferences = {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  focusModeEnabled: boolean;
  showAiThoughts: boolean;
  simulationSpeed: SimulationSpeed;
};

export type MissionStats = {
  analyzed: number;
  qualified: number;
  discarded: number;
  hot: number;
  potential: number;
};
