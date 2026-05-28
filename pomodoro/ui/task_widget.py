from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QListWidget, QListWidgetItem,
    QPushButton, QLineEdit, QLabel, QMessageBox, QSpinBox
)
from PySide6.QtCore import Qt

from ..core.task_manager import TaskManager


class TaskWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)

        self._input = QLineEdit()
        self._input.setPlaceholderText("输入任务标题，按回车添加...")
        self._input.setStyleSheet("""
            QLineEdit {
                border: 1px solid #ddd; border-radius: 4px;
                padding: 8px 12px; font-size: 13px;
            }
            QLineEdit:focus { border-color: #e74c3c; }
        """)
        self._input.returnPressed.connect(self._add_task)

        self._list = QListWidget()
        self._list.setStyleSheet("""
            QListWidget { border: none; background: transparent; }
            QListWidget::item { padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
            QListWidget::item:selected { background: #fde8e8; color: #333; }
        """)

        self._del_btn = QPushButton("删除选中")
        self._del_btn.setStyleSheet("""
            QPushButton {
                background: transparent; color: #e74c3c; border: 1px solid #e74c3c;
                border-radius: 4px; padding: 6px 14px; font-size: 12px;
            }
            QPushButton:hover { background: #e74c3c; color: white; }
        """)
        self._del_btn.clicked.connect(self._delete_task)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel("任务列表"))
        layout.addWidget(self._input)
        layout.addWidget(self._list)
        bottom = QHBoxLayout()
        bottom.addStretch()
        bottom.addWidget(self._del_btn)
        layout.addLayout(bottom)

        self._refresh()

    def _add_task(self):
        title = self._input.text().strip()
        if not title:
            return
        TaskManager.add_task(title)
        self._input.clear()
        self._refresh()

    def _delete_task(self):
        item = self._list.currentItem()
        if not item:
            return
        task_id = item.data(Qt.UserRole)
        TaskManager.delete_task(task_id)
        self._refresh()

    def _refresh(self):
        self._list.clear()
        tasks = TaskManager.get_all_tasks()
        for t in tasks:
            status_icon = {"todo": "□", "doing": "▶", "done": "✓"}.get(t["status"], "□")
            text = f"{status_icon}  {t['title']}  ({t['completed_pomodoros']}/{t['estimated_pomodoros']}🍅)"
            item = QListWidgetItem(text)
            item.setData(Qt.UserRole, t["id"])
            if t["status"] == "done":
                item.setForeground(Qt.gray)
            self._list.addItem(item)

    def refresh(self):
        self._refresh()
