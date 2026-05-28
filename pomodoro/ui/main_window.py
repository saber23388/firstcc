from PySide6.QtWidgets import (
    QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QTabWidget,
    QSystemTrayIcon, QMenu, QLabel, QFrame
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QAction, QIcon, QFont

from ..core.timer_engine import TimerEngine
from ..core.task_manager import TaskManager
from ..core.stats_manager import StatsManager
from .timer_widget import TimerWidget
from .task_widget import TaskWidget
from .stats_widget import StatsWidget


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Pomodoro")
        self.setMinimumSize(600, 400)
        self.resize(620, 420)
        self.setStyleSheet("""
            QMainWindow { background-color: #ffffff; }
            QTabWidget::pane { border: none; border-top: 1px solid #eee; }
            QTabBar::tab {
                background: #f5f5f5; border: none; padding: 8px 20px;
                font-size: 13px; color: #666;
            }
            QTabBar::tab:selected { background: white; color: #e74c3c; font-weight: bold; }
        """)

        self._engine = TimerEngine()
        self._engine.session_finished.connect(self._on_session_finished)

        timer_widget = TimerWidget(self._engine)

        self._task_widget = TaskWidget()
        self._stats_widget = StatsWidget()

        right_tabs = QTabWidget()
        right_tabs.addTab(self._task_widget, "任务")
        right_tabs.addTab(self._stats_widget, "统计")
        right_tabs.setMaximumWidth(320)

        separator = QFrame()
        separator.setFrameShape(QFrame.VLine)
        separator.setStyleSheet("color: #e0e0e0;")

        central = QWidget()
        main_layout = QHBoxLayout(central)
        main_layout.setContentsMargins(20, 16, 20, 16)
        main_layout.addWidget(timer_widget, 1)
        main_layout.addWidget(separator)
        main_layout.addWidget(right_tabs, 1)
        self.setCentralWidget(central)

        self._stats_update_timer = QTimer(self)
        self._stats_update_timer.timeout.connect(self._update_stats)
        self._stats_update_timer.start(2000)

        self._setup_tray()
        self._update_stats()

    def _setup_tray(self):
        icon = QIcon()
        # Create a simple pixmap icon programmatically
        from PySide6.QtGui import QPixmap, QPainter, QColor, QBrush
        pix = QPixmap(64, 64)
        pix.fill(Qt.transparent)
        p = QPainter(pix)
        p.setRenderHint(QPainter.Antialiasing)
        p.setBrush(QBrush(QColor("#e74c3c")))
        p.setPen(Qt.NoPen)
        p.drawEllipse(8, 8, 48, 48)
        p.setPen(QColor("#2e7d32"))
        p.setBrush(QBrush(QColor("#2e7d32")))
        p.drawRect(28, 12, 6, 16)
        p.end()
        icon.addPixmap(pix)

        self._tray = QSystemTrayIcon(icon, self)
        self._tray.setToolTip("Pomodoro")

        menu = QMenu()
        show_action = menu.addAction("显示主窗口")
        show_action.triggered.connect(self.show_and_raise)
        start_action = menu.addAction("开始计时")
        start_action.triggered.connect(self._engine.start)
        pause_action = menu.addAction("暂停计时")
        pause_action.triggered.connect(self._engine.pause)
        menu.addSeparator()
        quit_action = menu.addAction("退出")
        quit_action.triggered.connect(self._quit_app)

        self._tray.setContextMenu(menu)
        self._tray.activated.connect(self._on_tray_activated)
        self._tray.show()

    def show_and_raise(self):
        self.show()
        self.raise_()
        self.activateWindow()

    def closeEvent(self, event):
        event.ignore()
        self.hide()
        self._tray.showMessage("Pomodoro", "番茄钟已在后台运行", QSystemTrayIcon.Information, 1500)

    def _on_tray_activated(self, reason):
        if reason == QSystemTrayIcon.DoubleClick:
            self.show_and_raise()

    def _on_session_finished(self, info):
        session_id = StatsManager.add_session(
            task_id=None,
            start_time=info["start_time"],
            end_time=info["end_time"],
            duration_minutes=info["duration_minutes"],
            session_type=info["type"],
            completed=info["completed"],
        )

        if info["type"] == "work" and info["completed"]:
            msg = f"完成了一个 {info['duration_minutes']} 分钟的番茄！"
        elif info["type"] == "break" and info["completed"]:
            msg = "休息结束，准备开始新的番茄！"
        else:
            return

        self._tray.showMessage("Pomodoro", msg, QSystemTrayIcon.Information, 3000)
        self._update_stats()

    def _update_stats(self):
        self._stats_widget.refresh()
        self._task_widget.refresh()

    def _quit_app(self):
        self._tray.hide()
        from PySide6.QtWidgets import QApplication
        QApplication.quit()
