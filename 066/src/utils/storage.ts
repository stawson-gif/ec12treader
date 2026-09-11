/**
 * Безопасная работа с localStorage.
 *
 * В ряде случаев обращение к localStorage бросает исключение (режим «Блокировать
 * все cookie», приватный режим Safari, политика хранения на file://, корпоративные
 * ограничения). Необработанное исключение приводит к белому экрану, поэтому все
 * обращения обёрнуты в try/catch: приложение просто продолжает работать без
 * автосохранения.
 */

const memory = new Map<string, string>();
let available: boolean | null = null;

function probe(): boolean {
  if (available !== null) return available;
  try {
    const k = "__probe066__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function readRaw(key: string): string | null {
  if (!probe()) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

export function writeRaw(key: string, value: string): void {
  if (!probe()) {
    memory.set(key, value);
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // переполнение квоты или запрет записи — работаем в памяти
    memory.set(key, value);
  }
}

export function removeRaw(key: string): void {
  memory.delete(key);
  if (!probe()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* игнорируем */
  }
}

export const storageAvailable = () => probe();
