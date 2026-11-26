export const PAGE_SIZE = 6;

export const MIN_INPUT_LENGTH = 3;
export const MAX_INPUT_LENGTH = 50;
export const MAX_CODE_LENGTH = 10;
export const TEXT_INPUT_REGEX = /^[A-Za-z\u0600-\u06FF ]+$/;
export const NUMBER_INPUT_REGEX = /^[0-9]*\.?[0-9]+$/;
export const PHONE_NUMBER_REGEX = /^5\d{0,9}$/;
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK === "true";

export const SOCKET_RECONNECT_DELAY_MS = 1000;
export const SOCKET_RECONNECT_DELAY_MAX_MS = 15000;
export const SOCKET_EVENT_USER_UPDATE = "userConsumptionUpdate";
export const SOCKET_EVENT_WATCH_USER = "viewUserProfile";

export const LIVE_UPDATE_BATCH_MS = 300;
export const NOW_TICK_MS = 10000;
export const MOCK_TICK_MS = 1500;
export const LOW_BALANCE_PERCENT_DEFAULT = 15;
export const LOW_BALANCE_PERCENT_MIN = 1;
export const LOW_BALANCE_PERCENT_MAX = 50;
export const MOCK_STATUS_CONFIG = { leakStallMs: 8000 };
