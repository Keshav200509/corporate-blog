type LogContext = {
  requestId?: string;
  [key: string]: unknown;
};

function emit(level: "info" | "error", event: string, context?: LogContext) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...context
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  console.info(JSON.stringify(payload));
}

export function logInfo(event: string, context?: LogContext) {
  emit("info", event, context);
}

export function logError(event: string, context?: LogContext) {
  emit("error", event, context);
}
