export function shouldStartNewRun(checklist) {
  const {
    latest_run: latestRun,
    is_latest_run_complete: isLatestRunComplete
  } = checklist;

  return !latestRun || (latestRun && isLatestRunComplete);
}