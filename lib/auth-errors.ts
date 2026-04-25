export function normalizeAuthError(error: unknown) {
  const raw = error instanceof Error ? error.message : "Something went wrong while authenticating.";
  const lower = raw.toLowerCase();

  if (lower.includes("already exists")) {
    return {
      type: "existing-account" as const,
      message: "This email already has an account. Please log in instead.",
    };
  }

  if (lower.includes("invalid credentials")) {
    return {
      type: "invalid-credentials" as const,
      message: "Email or password is incorrect.",
    };
  }

  if (lower.includes("invalidsecret") || lower.includes("invalid secret")) {
    return {
      type: "invalid-credentials" as const,
      message: "Email or password is incorrect.",
    };
  }

  if (lower.includes("not configured")) {
    return {
      type: "setup" as const,
      message: "Auth is not fully configured yet. Please try again in a moment.",
    };
  }

  return {
    type: "unknown" as const,
    message: "Could not complete authentication. Please try again.",
  };
}
