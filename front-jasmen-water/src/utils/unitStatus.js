export const UNIT_STATUS = {
  LEAK: "leak",
  INACTIVE: "inactive",
  LOW: "low",
  OK: "ok",
};

export const INACTIVE_REASON = {
  VALVE_CLOSED: "valveClosed",
  OFFLINE: "offline",
};

export const STATUS_PRIORITY = [
  UNIT_STATUS.LEAK,
  UNIT_STATUS.INACTIVE,
  UNIT_STATUS.LOW,
  UNIT_STATUS.OK,
];

export const DEFAULT_LOW_BALANCE_RATIO = 0.15;
export const DEFAULT_OFFLINE_AFTER_MS = 15 * 60 * 1000;
export const DEFAULT_LEAK_STALL_MS = 2 * 60 * 1000;
export const DEFAULT_LEAK_MIN_FLOW = 0;
export const DEFAULT_CLOSED_VALVE_MAX_FLOW = 0;

export const DEFAULT_STATUS_CONFIG = {
  lowBalanceRatio: DEFAULT_LOW_BALANCE_RATIO,
  offlineAfterMs: DEFAULT_OFFLINE_AFTER_MS,
  leakStallMs: DEFAULT_LEAK_STALL_MS,
  leakMinFlow: DEFAULT_LEAK_MIN_FLOW,
  closedValveMaxFlow: DEFAULT_CLOSED_VALVE_MAX_FLOW,
};

export function toUnit(user) {
  return {
    id: user._id,
    name: user.userName,
    roomNumber: user.roomNumber,
    valveOpen: user.status === true || user.status === "true",
    consumption: Number(user.consumption) || 0,
    limit: Number(user.limit) || 0,
    flowRate: Number(user.flowRate) || 0,
    online: user.online,
    lastSeenAt: user.lastSeenAt ?? null,
    lastConsumptionChangeAt: user.lastConsumptionChangeAt ?? null,
  };
}

export function getRemainingBalance(unit) {
  return unit.limit - unit.consumption;
}

function isLeakSuspected(unit, config) {
  const hasFlowWhileValveClosed =
    !unit.valveOpen && unit.flowRate > config.closedValveMaxFlow;

  const hasStalledConsumption =
    unit.flowRate > config.leakMinFlow &&
    unit.lastSeenAt !== null &&
    unit.lastConsumptionChangeAt !== null &&
    unit.lastSeenAt - unit.lastConsumptionChangeAt >= config.leakStallMs;

  return hasFlowWhileValveClosed || hasStalledConsumption;
}

function isOffline(unit, config, now) {
  if (unit.online === false) return true;
  return (
    unit.lastSeenAt !== null && now - unit.lastSeenAt > config.offlineAfterMs
  );
}

function isLowBalance(unit, config) {
  return getRemainingBalance(unit) <= unit.limit * config.lowBalanceRatio;
}

export function getUnitStatus(unit, config = {}, now = Date.now()) {
  const settings = { ...DEFAULT_STATUS_CONFIG, ...config };

  if (isLeakSuspected(unit, settings)) {
    return { status: UNIT_STATUS.LEAK, reason: null };
  }

  if (!unit.valveOpen) {
    return {
      status: UNIT_STATUS.INACTIVE,
      reason: INACTIVE_REASON.VALVE_CLOSED,
    };
  }

  if (isOffline(unit, settings, now)) {
    return { status: UNIT_STATUS.INACTIVE, reason: INACTIVE_REASON.OFFLINE };
  }

  if (isLowBalance(unit, settings)) {
    return { status: UNIT_STATUS.LOW, reason: null };
  }

  return { status: UNIT_STATUS.OK, reason: null };
}

export function getWorstStatus(statuses) {
  return (
    STATUS_PRIORITY.find((status) => statuses.includes(status)) ??
    UNIT_STATUS.OK
  );
}

export function countStatuses(units, config = {}, now = Date.now()) {
  const counts = {
    [UNIT_STATUS.LEAK]: 0,
    [UNIT_STATUS.INACTIVE]: 0,
    [UNIT_STATUS.LOW]: 0,
    [UNIT_STATUS.OK]: 0,
  };

  units.forEach((unit) => {
    counts[getUnitStatus(unit, config, now).status] += 1;
  });

  return counts;
}

export function getBuildingStatus(units, config = {}, now = Date.now()) {
  const counts = countStatuses(units, config, now);
  const presentStatuses = STATUS_PRIORITY.filter(
    (status) => counts[status] > 0,
  );

  return { status: getWorstStatus(presentStatuses), counts };
}
