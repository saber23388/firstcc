import sys
sys.path.insert(0, "E:/pyside6_lib")

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt

from .db.database import init_db
from .ui.main_window import MainWindow


def main():
    QApplication.setHighDpiScaleFactorRoundingPolicy(
        Qt.HighDpiScaleFactorRoundingPolicy.PassThrough
    )
    app = QApplication(sys.argv)
    app.setQuitOnLastWindowClosed(False)
    app.setApplicationName("Pomodoro")

    init_db()

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
