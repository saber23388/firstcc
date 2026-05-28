from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

from ..core.timer_engine import TimerEngine


class TimerWidget(QWidget):
    def __init__(self, engine: TimerEngine, parent=None):
        super().__init__(parent)
        self._engine = engine

        self._time_label = QLabel("25:00")
        self._time_label.setAlignment(Qt.AlignCenter)
        self._time_label.setFont(QFont("Segoe UI", 52, QFont.Light))

        self._state_label = QLabel("准备就绪")
        self._state_label.setAlignment(Qt.AlignCenter)
        self._state_label.setFont(QFont("Segoe UI", 11))
        self._state_label.setStyleSheet("color: #888;")

        self._cycle_label = QLabel("")
        self._cycle_label.setAlignment(Qt.AlignCenter)
        self._cycle_label.setFont(QFont("Segoe UI", 10))
        self._cycle_label.setStyleSheet("color: #aaa;")

        btn_style = """
            QPushButton {
                background-color: #e74c3c; color: white; border: none;
                border-radius: 6px; padding: 10px 24px; font-size: 14px; font-weight: bold;
            }
            QPushButton:hover { background-color: #c0392b; }
            QPushButton:pressed { background-color: #a93226; }
        """

        self._start_btn = QPushButton("开始")
        self._start_btn.setStyleSheet(btn_style)
        self._start_btn.clicked.connect(self._on_start)

        self._pause_btn = QPushButton("暂停")
        self._pause_btn.setStyleSheet(btn_style.replace("#e74c3c", "#f39c12").replace("#c0392b", "#e67e22").replace("#a93226", "#d68910"))
        self._pause_btn.clicked.connect(self._on_pause)
        self._pause_btn.setVisible(False)

        self._reset_btn = QPushButton("重置")
        self._reset_btn.setStyleSheet("""
            QPushButton {
                background-color: #95a5a6; color: white; border: none;
                border-radius: 6px; padding: 10px 24px; font-size: 14px;
            }
            QPushButton:hover { background-color: #7f8c8d; }
        """)
        self._reset_btn.clicked.connect(self._on_reset)

        self._skip_btn = QPushButton("跳过")
        self._skip_btn.setStyleSheet("""
            QPushButton {
                background-color: transparent; color: #888; border: 1px solid #ccc;
                border-radius: 6px; padding: 8px 18px; font-size: 13px;
            }
            QPushButton:hover { background-color: #f0f0f0; }
        """)
        self._skip_btn.clicked.connect(self._on_skip)
        self._skip_btn.setVisible(False)

        btn_row = QHBoxLayout()
        btn_row.addStretch()
        btn_row.addWidget(self._start_btn)
        btn_row.addWidget(self._pause_btn)
        btn_row.addWidget(self._skip_btn)
        btn_row.addWidget(self._reset_btn)
        btn_row.addStretch()

        layout = QVBoxLayout(self)
        layout.addStretch()
        layout.addWidget(self._state_label)
        layout.addSpacing(8)
        layout.addWidget(self._time_label)
        layout.addSpacing(8)
        layout.addWidget(self._cycle_label)
        layout.addSpacing(16)
        layout.addLayout(btn_row)
        layout.addStretch()

        engine.tick.connect(self._on_tick)
        engine.state_changed.connect(self._on_state_changed)

    def _on_tick(self, remaining):
        m = remaining // 60
        s = remaining % 60
        self._time_label.setText(f"{m:02d}:{s:02d}")

    def _on_state_changed(self, state):
        if state == TimerEngine.STATE_IDLE:
            self._state_label.setText("准备就绪")
            self._state_label.setStyleSheet("color: #888;")
            self._cycle_label.setText("")
            self._start_btn.setVisible(True)
            self._pause_btn.setVisible(False)
            self._skip_btn.setVisible(False)
            self._time_label.setText(self._engine.working_time_str())
        elif state == TimerEngine.STATE_WORKING:
            count = self._engine._completed_count + 1
            self._state_label.setText("专注工作中")
            self._state_label.setStyleSheet("color: #e74c3c; font-weight: bold;")
            self._cycle_label.setText(f"第 {count} 个番茄")
            self._start_btn.setVisible(False)
            self._pause_btn.setVisible(True)
            self._skip_btn.setVisible(True)
        elif state == TimerEngine.STATE_BREAK:
            self._state_label.setText("休息一下")
            self._state_label.setStyleSheet("color: #27ae60; font-weight: bold;")
            self._cycle_label.setText(f"已完成 {self._engine._completed_count} 个番茄，休息中")
            self._start_btn.setVisible(False)
            self._pause_btn.setVisible(True)
            self._skip_btn.setVisible(True)

    def _on_start(self):
        self._engine.start()

    def _on_pause(self):
        self._engine.pause()
        self._start_btn.setVisible(True)
        self._pause_btn.setVisible(False)
        self._skip_btn.setVisible(False)
        self._state_label.setText("已暂停")
        self._state_label.setStyleSheet("color: #f39c12;")

    def _on_reset(self):
        self._engine.reset()

    def _on_skip(self):
        self._engine.skip()
