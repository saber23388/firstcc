from datetime import date, timedelta
from PySide6.QtSql import QSqlQuery

from ..db.database import get_db


class StatsManager:
    @staticmethod
    def add_session(task_id, start_time, end_time, duration_minutes, session_type, completed):
        q = QSqlQuery(get_db())
        q.prepare(
            "INSERT INTO pomodoro_sessions (task_id, start_time, end_time, duration_minutes, type, completed) "
            "VALUES (?, ?, ?, ?, ?, ?)"
        )
        q.addBindValue(task_id)
        q.addBindValue(start_time)
        q.addBindValue(end_time)
        q.addBindValue(duration_minutes)
        q.addBindValue(session_type)
        q.addBindValue(completed)
        q.exec()

    @staticmethod
    def get_daily_counts(days=7):
        """Return daily completed work pomodoro counts for last N days."""
        q = QSqlQuery(get_db())
        q.prepare("""
            SELECT date(start_time) as d, COUNT(*) as cnt
            FROM pomodoro_sessions
            WHERE type = 'work' AND completed = 1
              AND date(start_time) >= date('now', 'localtime', ?)
            GROUP BY d ORDER BY d
        """)
        q.addBindValue(f"-{days} days")
        q.exec()
        result = []
        while q.next():
            result.append({"date": q.value(0), "count": q.value(1)})
        return result

    @staticmethod
    def get_today_count():
        q = QSqlQuery(get_db())
        q.exec("""
            SELECT COUNT(*) FROM pomodoro_sessions
            WHERE type = 'work' AND completed = 1
              AND date(start_time) = date('now', 'localtime')
        """)
        if q.next():
            return q.value(0)
        return 0

    @staticmethod
    def get_week_count():
        q = QSqlQuery(get_db())
        q.exec("""
            SELECT COUNT(*) FROM pomodoro_sessions
            WHERE type = 'work' AND completed = 1
              AND date(start_time) >= date('now', 'localtime', '-7 days')
        """)
        if q.next():
            return q.value(0)
        return 0

    @staticmethod
    def get_total_count():
        q = QSqlQuery(get_db())
        q.exec("SELECT COUNT(*) FROM pomodoro_sessions WHERE type = 'work' AND completed = 1")
        if q.next():
            return q.value(0)
        return 0
