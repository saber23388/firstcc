# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Run

```
cd E:\AI应用\firstcc
python -m pomodoro.main
```

PySide6 is installed to `E:/pyside6_lib` (not site-packages) — `main.py` inserts this into `sys.path` at startup.

## Architecture

Three-layer package structure with Qt signals driving communication:

**`core/`** — state and logic, no UI code
- `TimerEngine` (QObject): state machine `IDLE → WORKING → BREAK`, driven by a 1-second QTimer. Emits `tick(int seconds)`, `state_changed(str)`, `session_finished(dict)` signals. Session transitions auto-stop the timer — user must manually start the next phase.
- `TaskManager` / `StatsManager`: static methods operating on SQLite via QSqlQuery. All DB access uses parameterized queries.

**`db/`** — database
- SQLite via `QSqlDatabase` with named connection `"pomodoro"`. Data file at `~/.pomodoro/pomodoro.db`. `init_db()` is idempotent (CREATE TABLE IF NOT EXISTS).

**`ui/`** — Qt widgets
- `MainWindow` owns the `TimerEngine` instance and wires `session_finished` → `StatsManager.add_session()` + tray notification. A 2-second polling QTimer calls `_update_stats()` to refresh stats and task list.
- `TimerWidget` binds to `TimerEngine.tick` and `state_changed` signals to update the display.
- Close event is intercepted — the window hides to system tray. `app.setQuitOnLastWindowClosed(False)` keeps the process alive.

**`main.py`** — entry point. Calls `init_db()`, creates `MainWindow`, runs the event loop.

## Key patterns

- All intra-package imports use explicit relative imports (`from ..core.timer_engine import TimerEngine`).
- `app.setQuitOnLastWindowClosed(False)` is required — without it, hiding to tray would exit the process.
- The tray icon is drawn programmatically via QPainter (no external icon file required).
- Qt style is defined inline as stylesheet strings in each widget, not in external `.qss` files.
