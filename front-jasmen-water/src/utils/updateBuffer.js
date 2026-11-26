export function createUpdateBuffer(onFlush, intervalMs) {
  let pendingByUserId = new Map();
  let timer = null;

  function flush() {
    timer = null;
    if (pendingByUserId.size === 0) return;
    const updates = [...pendingByUserId.values()];
    pendingByUserId = new Map();
    onFlush(updates);
  }

  return {
    push(update) {
      pendingByUserId.set(update.userId, update);
      if (timer === null) timer = setTimeout(flush, intervalMs);
    },
    cancel() {
      clearTimeout(timer);
      timer = null;
      pendingByUserId = new Map();
    },
  };
}
