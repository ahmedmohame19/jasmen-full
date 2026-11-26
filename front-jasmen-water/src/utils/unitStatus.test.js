import { describe, expect, it } from "vitest";
import {
  getBuildingStatus,
  getUnitStatus,
  INACTIVE_REASON,
  UNIT_STATUS,
} from "./unitStatus";

const NOW = 1_700_000_000_000;
const MINUTE_MS = 60 * 1000;

function createUnit(overrides = {}) {
  return {
    id: "unit-1",
    valveOpen: true,
    consumption: 400,
    limit: 1000,
    flowRate: 0.5,
    online: undefined,
    lastSeenAt: NOW,
    lastConsumptionChangeAt: NOW,
    ...overrides,
  };
}

describe("getUnitStatus", () => {
  it("returns ok for a working unit with enough balance", () => {
    expect(getUnitStatus(createUnit(), {}, NOW).status).toBe(UNIT_STATUS.OK);
  });

  it("returns low when remaining balance is at or below the threshold", () => {
    const unit = createUnit({ consumption: 850 });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.LOW);
  });

  it("respects a custom low balance ratio", () => {
    const unit = createUnit({ consumption: 700 });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.OK);
    expect(getUnitStatus(unit, { lowBalanceRatio: 0.4 }, NOW).status).toBe(
      UNIT_STATUS.LOW,
    );
  });

  it("returns inactive with valveClosed reason when the valve is closed", () => {
    const unit = createUnit({ valveOpen: false, flowRate: 0 });
    expect(getUnitStatus(unit, {}, NOW)).toEqual({
      status: UNIT_STATUS.INACTIVE,
      reason: INACTIVE_REASON.VALVE_CLOSED,
    });
  });

  it("returns inactive with offline reason when the device went silent", () => {
    const unit = createUnit({ lastSeenAt: NOW - 20 * MINUTE_MS });
    expect(getUnitStatus(unit, {}, NOW)).toEqual({
      status: UNIT_STATUS.INACTIVE,
      reason: INACTIVE_REASON.OFFLINE,
    });
  });

  it("returns inactive when the device is explicitly offline", () => {
    const unit = createUnit({ online: false });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.INACTIVE);
  });

  it("does not mark a unit offline when last seen time is unknown", () => {
    const unit = createUnit({ lastSeenAt: null });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.OK);
  });

  it("returns leak when flow continues but consumption has stalled", () => {
    const unit = createUnit({
      flowRate: 1.6,
      lastConsumptionChangeAt: NOW - 5 * MINUTE_MS,
    });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.LEAK);
  });

  it("does not return leak when the device stopped reporting", () => {
    const unit = createUnit({
      flowRate: 1.6,
      lastSeenAt: NOW - 5 * MINUTE_MS,
      lastConsumptionChangeAt: NOW - 5 * MINUTE_MS,
    });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.OK);
  });

  it("does not return leak when the stall time is unknown", () => {
    const unit = createUnit({ flowRate: 1.6, lastConsumptionChangeAt: null });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.OK);
  });

  it("returns leak when there is flow while the valve is closed", () => {
    const unit = createUnit({ valveOpen: false, flowRate: 0.9 });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.LEAK);
  });

  it("allows a configurable flow tolerance while the valve is closed", () => {
    const unit = createUnit({ valveOpen: false, flowRate: 0.9 });
    expect(getUnitStatus(unit, { closedValveMaxFlow: 1 }, NOW).status).toBe(
      UNIT_STATUS.INACTIVE,
    );
  });

  it("prioritizes leak over inactive and low", () => {
    const unit = createUnit({
      valveOpen: false,
      flowRate: 0.9,
      consumption: 990,
      lastSeenAt: NOW - 60 * MINUTE_MS,
    });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.LEAK);
  });

  it("prioritizes inactive over low", () => {
    const unit = createUnit({
      valveOpen: false,
      flowRate: 0,
      consumption: 990,
    });
    expect(getUnitStatus(unit, {}, NOW).status).toBe(UNIT_STATUS.INACTIVE);
  });
});

describe("getBuildingStatus", () => {
  it("returns the worst status with counts for every status", () => {
    const units = [
      createUnit({ id: "a" }),
      createUnit({ id: "b", consumption: 900 }),
      createUnit({ id: "c", valveOpen: false, flowRate: 0 }),
      createUnit({ id: "d", valveOpen: false, flowRate: 0.9 }),
    ];
    expect(getBuildingStatus(units, {}, NOW)).toEqual({
      status: UNIT_STATUS.LEAK,
      counts: { leak: 1, inactive: 1, low: 1, ok: 1 },
    });
  });

  it("returns ok for a building without units", () => {
    expect(getBuildingStatus([], {}, NOW).status).toBe(UNIT_STATUS.OK);
  });
});
