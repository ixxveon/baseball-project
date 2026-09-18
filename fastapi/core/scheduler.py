import os
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler

from service.preprocessor.stat_preprocessor import DatabaseSaver, run_daily_update

KST = ZoneInfo("Asia/Seoul")


def _db_config() -> dict[str, str]:
    return {
        "host": os.environ.get("PGHOST", "localhost"),
        "port": os.environ.get("PGPORT", "5432"),
        "dbname": os.environ.get("PGDATABASE", "winningpick"),
        "user": os.environ.get("PGUSER", "postgres"),
        "password": os.environ.get("PGPASSWORD", ""),
    }


def run_daily_batch_job() -> None:
    """매일 00:00에 실행 - 어제(방금 끝난 경기들의 날짜) 기준으로 배치를 돌린다."""
    target_date = datetime.now(tz=KST).date() - timedelta(days=1)
    db_config = _db_config()
    db_saver = DatabaseSaver(db_config, dry_run=False)

    if db_saver.has_run_for(target_date):
        print(f"[스케줄러] {target_date} 배치는 이미 실행됨 - 스킵")
        return

    print(f"[스케줄러] {target_date} 배치 실행 시작")
    try:
        run_daily_update(dataset_dir="dataset", db_config=db_config, dry_run=False, today=target_date)
        db_saver.record_run(target_date)
        print(f"[스케줄러] {target_date} 배치 실행 완료")
    except Exception as e:  # noqa: BLE001 - 스케줄러 잡 자체가 죽어서 다음 실행까지 안 되는 걸 막기 위한 최종 방어선
        print(f"[스케줄러] {target_date} 배치 실행 중 오류 발생: {e}")


def start_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone=KST)
    scheduler.add_job(run_daily_batch_job, "cron", hour=0, minute=0, id="daily_update")
    scheduler.start()
    return scheduler