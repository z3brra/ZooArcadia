export type AttemptsData = {
    count: number
    firstAt: number
}

const STORAGE_KEY = import.meta.env.VITE_LOGIN_STORAGE_KEY || 'login_attempts'
const MAX_ATTEMPTS = Number(import.meta.env.VITE_LOGIN_MAX_ATTEMPTS) || 5
const LOCK_DURATION = (Number(import.meta.env.VITE_LOGIN_LOCK_DURATION_MIN) || 15) * 60 * 1000

export function loadAttempts(): AttemptsData {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
        return { count: 0, firstAt: Date.now() }
    }
    try {
        return JSON.parse(raw) as AttemptsData
    } catch {
        return { count: 0, firstAt: Date.now() }
    }
}

export function saveAttempts(data: AttemptsData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearAttempts(): void {
    localStorage.removeItem(STORAGE_KEY)
}

export function incrementAttempts(): AttemptsData {
    const previous = loadAttempts()
    const now = Date.now()
    const first = previous.count === 0 ? now : previous.firstAt
    const next: AttemptsData = { count: previous.count + 1, firstAt: first }
    saveAttempts(next)
    return next
}

export function isLocked(): boolean {
    const { count, firstAt } = loadAttempts()
    const elapsed = Date.now() - firstAt
    if (elapsed > LOCK_DURATION) {
        clearAttempts()
        return false
    }
    return count >= MAX_ATTEMPTS
}

export function getRetryInMinutes(): number {
    const { firstAt } = loadAttempts()
    const remainMs = LOCK_DURATION - (Date.now() - firstAt)
    return Math.max(0, Math.ceil(remainMs / 60000))
}