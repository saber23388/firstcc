from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel
from PySide6.QtCharts import QChart, QChartView, QBarSeries, QBarSet, QBarCategoryAxis, QValueAxis
from PySide6.QtCore import Qt
from PySide6.QtGui import QPainter, QFont

from ..core.stats_manager import StatsManager


class StatsWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)

        self._today_label = QLabel()
        self._week_label = QLabel()
        self._total_label = QLabel()

        for lbl, color in [(self._today_label, "#e74c3c"), (self._week_label, "#f39c12"), (self._total_label, "#27ae60")]:
            lbl.setFont(QFont("Segoe UI", 12))
            lbl.setStyleSheet(f"color: {color}; padding: 4px 0;")

        summary_layout = QVBoxLayout()
        summary_layout.addWidget(self._today_label)
        summary_layout.addWidget(self._week_label)
        summary_layout.addWidget(self._total_label)
        summary_layout.addStretch()

        self._chart_view = self._create_chart()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(QLabel("统计"))
        layout.addWidget(self._chart_view, 1)
        layout.addLayout(summary_layout)

    def _create_chart(self):
        series = QBarSeries()
        self._barset = QBarSet("番茄数")
        self._barset.setColor("#e74c3c")
        series.append(self._barset)

        chart = QChart()
        chart.addSeries(series)
        chart.setTitle("最近 7 天完成番茄数")
        chart.setAnimationOptions(QChart.SeriesAnimations)
        chart.legend().setVisible(False)
        chart.setBackgroundBrush(Qt.white)

        self._axis_x = QBarCategoryAxis()
        self._axis_x.append(["", "", "", "", "", "", ""])
        chart.addAxis(self._axis_x, Qt.AlignBottom)
        series.attachAxis(self._axis_x)

        self._axis_y = QValueAxis()
        self._axis_y.setRange(0, 10)
        self._axis_y.setLabelFormat("%d")
        chart.addAxis(self._axis_y, Qt.AlignLeft)
        series.attachAxis(self._axis_y)

        view = QChartView(chart)
        view.setRenderHint(QPainter.Antialiasing)
        return view

    def refresh(self):
        today = StatsManager.get_today_count()
        week = StatsManager.get_week_count()
        total = StatsManager.get_total_count()

        self._today_label.setText(f"今日: {today} 个番茄")
        self._week_label.setText(f"本周: {week} 个番茄")
        self._total_label.setText(f"总计: {total} 个番茄")

        daily = StatsManager.get_daily_counts(7)
        full = {}
        from datetime import date, timedelta
        for i in range(7):
            d = (date.today() - timedelta(days=6 - i)).isoformat()
            full[d] = 0
        for row in daily:
            full[row["date"]] = row["count"]

        self._barset.remove(0, self._barset.count())
        labels = []
        max_val = 1
        for d, c in full.items():
            self._barset.append(c)
            labels.append(d[-5:])  # MM-DD
            if c > max_val:
                max_val = c

        self._axis_x.clear()
        self._axis_x.append(labels)
        self._axis_y.setRange(0, max(max_val + 2, 5))
