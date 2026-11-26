export const LIVE_UNITS_QUERY_KEY = ["unitLive"];

function mergeUpdate(previous, update, now) {
  const consumption = update.consumption ?? previous?.consumption;
  const consumptionChanged =
    previous === undefined || consumption !== previous.consumption;

  return {
    status: update.state ?? previous?.status,
    consumption,
    limit: update.consumptionLimit ?? previous?.limit,
    flowRate: update.flowRate ?? previous?.flowRate,
    online: true,
    lastSeenAt: now,
    lastConsumptionChangeAt: consumptionChanged
      ? now
      : previous.lastConsumptionChangeAt,
  };
}

export function applyUnitUpdates(queryClient, updates, now = Date.now()) {
  queryClient.setQueryData(LIVE_UNITS_QUERY_KEY, (previousMap = {}) => {
    const nextMap = { ...previousMap };
    updates.forEach((update) => {
      nextMap[update.userId] = mergeUpdate(
        previousMap[update.userId],
        update,
        now,
      );
    });
    return nextMap;
  });
}
