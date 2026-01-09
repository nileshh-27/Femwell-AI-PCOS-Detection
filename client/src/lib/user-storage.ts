export function scopedKey(base: string, userId?: string | null) {
  return userId ? `${base}:${userId}` : base;
}

export const STORAGE_BASE_KEYS = {
  assessmentResult: "assessmentResult",
  profile: "femwell_profile",
} as const;

export function assessmentResultKey(userId?: string | null) {
  return scopedKey(STORAGE_BASE_KEYS.assessmentResult, userId);
}

export function profileKey(userId?: string | null) {
  return scopedKey(STORAGE_BASE_KEYS.profile, userId);
}

export function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function removeAllScoped(baseKey: string) {
  const prefix = `${baseKey}:`;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key === baseKey || key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }
}
