const BUILDING_NAMES = [
  "Palm Residence",
  "Nile View",
  "Sunrise Court",
  "Harbor Heights",
  "Green Garden",
  "Pearl Tower",
  "Oasis Block",
  "Lotus Plaza",
];

const FORCED_SCENARIOS = {
  0: ["stalledLeak", "closedLeak", "low", "closed", "offline"],
  1: ["low", "low", "stalledLeak"],
  2: ["closed", "low"],
  3: ["offline", "closedLeak"],
};

const HEALTHY_BUILDING_INDEXES = new Set([4, 6]);

const WEIGHTED_SCENARIOS = [
  ["ok", 70],
  ["low", 14],
  ["closed", 10],
  ["offline", 6],
];

const MOCK_LIMIT = 1000;
const MOCK_LEAK_FLOW = 1.6;
const MOCK_TOP_UP_AMOUNT = 500;
const MINUTE_MS = 60 * 1000;

function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function pickScenario(random) {
  let roll = random() * 100;
  for (const [scenario, weight] of WEIGHTED_SCENARIOS) {
    roll -= weight;
    if (roll < 0) return scenario;
  }
  return "ok";
}

function createUser({
  buildingId,
  buildingIndex,
  unitIndex,
  scenario,
  random,
  now,
}) {
  const user = {
    _id: `${buildingId}-user-${unitIndex + 1}`,
    userName: `Resident ${buildingIndex + 1}-${unitIndex + 1}`,
    email: `resident${buildingIndex + 1}${unitIndex + 1}@example.com`,
    mobile: `5${String(10000000 + Math.floor(random() * 89999999))}`,
    roomNumber: 100 + unitIndex + 1,
    building: buildingId,
    status: true,
    limit: MOCK_LIMIT,
    consumption: Math.round(MOCK_LIMIT * (0.2 + random() * 0.45)),
    flowRate: Number((0.3 + random() * 0.4).toFixed(2)),
    lastSeenAt: now,
    lastConsumptionChangeAt: now,
  };

  if (scenario === "low") {
    user.consumption = Math.round(MOCK_LIMIT * (0.88 + random() * 0.09));
  }
  if (scenario === "closed") {
    user.status = false;
    user.flowRate = 0;
  }
  if (scenario === "offline") {
    user.lastSeenAt = now - 30 * MINUTE_MS;
  }
  if (scenario === "stalledLeak") {
    user.flowRate = MOCK_LEAK_FLOW;
    user.lastConsumptionChangeAt = now - 10 * MINUTE_MS;
  }
  if (scenario === "closedLeak") {
    user.status = false;
    user.flowRate = 0.9;
  }

  return user;
}

function createMockStore() {
  const random = createRandom(42);
  const now = Date.now();

  const details = BUILDING_NAMES.map((buildingName, buildingIndex) => {
    const buildingId = `mock-building-${buildingIndex + 1}`;
    const unitCount = 6 + ((buildingIndex * 2) % 7);
    const forcedScenarios = FORCED_SCENARIOS[buildingIndex] ?? [];

    const users = Array.from({ length: unitCount }, (_, unitIndex) =>
      createUser({
        buildingId,
        buildingIndex,
        unitIndex,
        scenario: HEALTHY_BUILDING_INDEXES.has(buildingIndex)
          ? "ok"
          : (forcedScenarios[unitIndex] ?? pickScenario(random)),
        random,
        now,
      }),
    );

    return {
      _id: buildingId,
      buildingName,
      buildingAddress: `Demo district, block ${buildingIndex + 1}`,
      buildingCode: `B${100 + buildingIndex + 1}`,
      buildingDescription: "Demo building",
      buildingLogo: "",
      users,
      userCount: users.length,
    };
  });

  return details;
}

let mockStore = null;

function getMockStore() {
  if (mockStore === null) mockStore = createMockStore();
  return mockStore;
}

function simulateNetworkDelay() {
  return new Promise((resolve) => setTimeout(resolve, 250));
}

export async function getMockBuildings() {
  await simulateNetworkDelay();
  const buildings = getMockStore().map(({ users, ...building }) => building);
  return { buildings, totalBuildings: buildings.length };
}

export async function getMockBuildingDetails(id) {
  await simulateNetworkDelay();
  const building = getMockStore().find((candidate) => candidate._id === id);
  if (!building) throw new Error("Building not found");
  return building;
}

export function nextMockUpdate(user, random = Math.random) {
  const base = {
    userId: user._id,
    state: user.status,
    consumption: user.consumption,
    consumptionLimit: user.limit,
    flowRate: user.flowRate,
  };
  const roll = random();
  const isLeaking = user.flowRate >= MOCK_LEAK_FLOW;
  const isFlowing = user.status && user.flowRate > 0;
  const advancedConsumption = isFlowing
    ? Math.round(user.consumption + 5 + random() * 25)
    : user.consumption;

  if (isLeaking) {
    return roll < 0.3
      ? { ...base, flowRate: 0.4, consumption: user.consumption + 5 }
      : base;
  }
  if (roll < 0.06) {
    return {
      ...base,
      state: !user.status,
      flowRate: user.status ? 0 : 0.5,
      consumption: advancedConsumption,
    };
  }
  if (roll < 0.08) {
    return { ...base, flowRate: MOCK_LEAK_FLOW };
  }
  if (roll < 0.13) {
    return {
      ...base,
      consumptionLimit: user.limit + MOCK_TOP_UP_AMOUNT,
      consumption: advancedConsumption,
    };
  }
  if (!user.status) return { ...base, flowRate: 0 };

  return {
    ...base,
    flowRate: Number((0.2 + random() * 0.6).toFixed(2)),
    consumption: advancedConsumption,
  };
}
