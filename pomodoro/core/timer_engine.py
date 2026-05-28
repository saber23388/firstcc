from datetime import datetime

from PySide6.QtCore import QTimer, QObject, Signal


class TimerEngine(QObject):
    STATE_IDLE = "idle"
    STATE_WORKING = "working"
    STATE_BREAK = "break"

    tick = Signal(int)  # remaining_seconds
    state_changed = Signal(str)  # new_state
    session_finished = Signal(dict)  # session_info dict

    def __init__(self, work_minutes=25, break_minutes=5, parent=None):
        super().__init__(parent)
        self.work_seconds = work_minutes * 60
        self.break_seconds = break_minutes * 60
        self._remaining = self.work_seconds
        self._state = self.STATE_IDLE
        self._session_start = None
        self._session_type = None
        self._completed_count = 0  # work sessions completed in current cycle

        self._timer = QTimer(self)
        self._timer.timeout.connect(self._on_tick)

    @property
    def state(self):
        return self._state

    @property
    def remaining_seconds(self):
        return self._remaining

    def start(self):
        if self._state == self.STATE_IDLE:
            self._transition_to(self.STATE_WORKING)
        self._timer.start(1000)

    def pause(self):
        self._timer.stop()

    def reset(self):
        self._timer.stop()
        self._state = self.STATE_IDLE
        self._remaining = self.work_seconds
        self._completed_count = 0
        self._session_start = None
        self._session_type = None
        self.tick.emit(self._remaining)
        self.state_changed.emit(self.STATE_IDLE)

    def skip(self):
        """Skip current phase, go to next."""
        if self._state == self.STATE_WORKING:
            self._finish_session(completed=False)
            self._transition_to(self.STATE_BREAK)
        elif self._state == self.STATE_BREAK:
            self._finish_session(completed=False)
            self._transition_to(self.STATE_WORKING)

    def set_durations(self, work_minutes, break_minutes):
        self.work_seconds = work_minutes * 60
        self.break_seconds = break_minutes * 60
        if self._state == self.STATE_IDLE:
            self._remaining = self.work_seconds
            self.tick.emit(self._remaining)

    def _transition_to(self, state):
        self._state = state
        self._session_start = datetime.now()
        self._session_type = state
        self._remaining = self.work_seconds if state == self.STATE_WORKING else self.break_seconds
        self.tick.emit(self._remaining)
        self.state_changed.emit(state)

    def _on_tick(self):
        self._remaining -= 1
        self.tick.emit(self._remaining)

        if self._remaining <= 0:
            self._finish_session(completed=True)
            if self._state == self.STATE_WORKING:
                self._completed_count += 1
                self._transition_to(self.STATE_BREAK)
            elif self._state == self.STATE_BREAK:
                self._transition_to(self.STATE_WORKING)

    def _finish_session(self, completed):
        self._timer.stop()
        info = {
            "start_time": self._session_start.isoformat() if self._session_start else None,
            "end_time": datetime.now().isoformat(),
            "duration_minutes": (self.work_seconds if self._session_type == self.STATE_WORKING else self.break_seconds) // 60,
            "type": self._session_type,
            "completed": int(completed),
        }
        self.session_finished.emit(info)

    def working_time_str(self):
        m = self.work_seconds // 60
        s = self.work_seconds % 60
        return f"{m:02d}:{s:02d}"

    def break_time_str(self):
        m = self.break_seconds // 60
        s = self.break_seconds % 60
        return f"{m:02d}:{s:02d}"
