import { Component, type ErrorInfo, type ReactNode } from "react";
import { removeRaw } from "../utils/storage";

type Props = { children: ReactNode };
type State = { error: Error | null; info: string };

/**
 * Перехватчик ошибок рендеринга. Без него любая ошибка React приводит к
 * полностью белому экрану без единого пояснения — с ним пользователь видит,
 * что именно случилось, и может сохранить данные.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: "" };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(_error: Error, info: ErrorInfo) {
    this.setState({ info: info.componentStack || "" });
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 border-t-4 border-t-rose-500 bg-white p-7 shadow-lg">
          <h1 className="text-xl font-bold text-slate-900">Произошла ошибка при отображении формы</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Приложение остановилось из-за ошибки в данных или в браузере. Введённые данные сохранены
            в этом браузере — после исправления проблемы они подгрузятся автоматически.
          </p>

          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-900">
            <b>Что произошло:</b>
            <div className="mt-1 break-words">{error.message || String(error)}</div>
          </div>

          {info && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-500">
                Техническая информация
              </summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-[10px] leading-snug text-slate-100">
                {info.trim()}
              </pre>
            </details>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              onClick={() => window.location.reload()}
            >
              Перезагрузить
            </button>
            <button
              className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
              onClick={() => {
                removeRaw("form066y.v1");
                window.location.reload();
              }}
            >
              Сбросить данные и открыть пустую карту
            </button>
          </div>
        </div>
      </div>
    );
  }
}
