from PySide6.QtSql import QSqlQuery

from ..db.database import get_db


class TaskManager:
    @staticmethod
    def add_task(title, description="", estimated=1):
        q = QSqlQuery(get_db())
        q.prepare("INSERT INTO tasks (title, description, estimated_pomodoros) VALUES (?, ?, ?)")
        q.addBindValue(title)
        q.addBindValue(description)
        q.addBindValue(estimated)
        q.exec()
        return q.lastInsertId()

    @staticmethod
    def update_task(task_id, title=None, description=None, estimated=None, status=None):
        fields = {}
        if title is not None:
            fields["title"] = title
        if description is not None:
            fields["description"] = description
        if estimated is not None:
            fields["estimated_pomodoros"] = estimated
        if status is not None:
            fields["status"] = status
        if not fields:
            return

        q = QSqlQuery(get_db())
        sets = ", ".join(f"{k} = ?" for k in fields)
        values = list(fields.values()) + [task_id]
        q.prepare(f"UPDATE tasks SET {sets} WHERE id = ?")
        for v in values:
            q.addBindValue(v)
        q.exec()

    @staticmethod
    def delete_task(task_id):
        q = QSqlQuery(get_db())
        q.prepare("DELETE FROM tasks WHERE id = ?")
        q.addBindValue(task_id)
        q.exec()

    @staticmethod
    def get_all_tasks():
        q = QSqlQuery(get_db())
        q.exec("SELECT id, title, description, estimated_pomodoros, completed_pomodoros, status, created_at FROM tasks ORDER BY status, created_at DESC")
        tasks = []
        while q.next():
            tasks.append({
                "id": q.value(0),
                "title": q.value(1),
                "description": q.value(2),
                "estimated_pomodoros": q.value(3),
                "completed_pomodoros": q.value(4),
                "status": q.value(5),
                "created_at": q.value(6),
            })
        return tasks

    @staticmethod
    def increment_pomodoro(task_id):
        q = QSqlQuery(get_db())
        q.prepare("UPDATE tasks SET completed_pomodoros = completed_pomodoros + 1 WHERE id = ?")
        q.addBindValue(task_id)
        q.exec()
