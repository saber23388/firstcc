import os
from PySide6.QtSql import QSqlDatabase, QSqlQuery

DB_DIR = os.path.join(os.path.expanduser("~"), ".pomodoro")
DB_PATH = os.path.join(DB_DIR, "pomodoro.db")


def get_db() -> QSqlDatabase:
    db = QSqlDatabase.database("pomodoro", open=False)
    if not db.isValid():
        db = QSqlDatabase.addDatabase("QSQLITE", "pomodoro")
        db.setDatabaseName(DB_PATH)
    if not db.isOpen():
        db.open()
    return db


def init_db():
    os.makedirs(DB_DIR, exist_ok=True)
    db = get_db()

    db.exec("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            estimated_pomodoros INTEGER DEFAULT 1,
            completed_pomodoros INTEGER DEFAULT 0,
            status TEXT DEFAULT 'todo',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        )
    """)

    db.exec("""
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            start_time TEXT NOT NULL,
            end_time TEXT,
            duration_minutes INTEGER NOT NULL,
            type TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            FOREIGN KEY (task_id) REFERENCES tasks(id)
        )
    """)
