import os
import traceback
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from apscheduler.events import EVENT_JOB_ERROR
from apscheduler.schedulers.background import BackgroundScheduler

from service.preprocessor.stat_preprocessor import DatabaseSaver, run_daily_update
from service.services.prediction_service import PredictionService

KST = ZoneInfo("Asia/Seoul")


def _db_config() -> dict[str, str]:
    return {
        "host": os.environ.get("PGHOST", "localhost"),
        "port": os.environ.get("PGPORT", "5432"),
        "dbname": os.environ.get("PGDATABASE", "winningpick"),
        "user": os.environ.get("PGUSER", "postgres"),
        "password": os.environ.get("PGPASSWORD", ""),
    }


def _precompute_predictions() -> None:
    service = PredictionService()
    games = service.get_upcoming_games()
    print(f"[스케줄러] 사전계산 대상 경기 {len(games)}건")

    success = 0
    failures: list[Exception] = []
    for g in games:
        try:
            service.predict(game_id=g.gameId)
            success += 1
        except Exception as e:
            failures.append(e)
            print(f"[스케줄러] game_id={g.gameId} 사전계산 실패:\n{traceback.format_exc()}")

    print(f"[스케줄러] 사전계산 완료 - 성공 {success}건, 실패 {len(failures)}건")

    if failures:
        raise ExceptionGroup(
            f"경기 사전계산 {len(failures)}건 실패 (대상 {len(games)}건 중) - "
            "실패한 경기는 다음 배치에서 자동으로 재시도됩니다",
            failures,
        )


def _pending_run_dates(db_saver: DatabaseSaver, target_date: date) -> list[date]:
    last_run = db_saver.get_last_run_date()
    if last_run is None:
        return [target_date]
    if last_run >= target_date:
        return []

    dates: list[date] = []
    d = last_run + timedelta(days=1)
    while d <= target_date:
        dates.append(d)
        d += timedelta(days=1)
    return dates


def run_daily_batch_job() -> None:
    target_date = datetime.now(tz=KST).date() - timedelta(days=1)
    db_config = _db_config()
    db_saver = DatabaseSaver(db_config, dry_run=False)

    lock_conn = db_saver.try_acquire_daily_batch_lock()
    if lock_conn is None:
        print("[스케줄러] 다른 프로세스가 이미 배치를 실행 중 - 스킵")
        return

    try:
        pending_dates = _pending_run_dates(db_saver, target_date)
        if not pending_dates:
            print(f"[스케줄러] {target_date} 배치는 이미 실행됨 - 스킵")
            return

        ran_any = False
        for run_date in pending_dates:
            print(f"[스케줄러] {run_date} 배치 실행 시작")
            try:
                run_daily_update(dataset_dir="dataset", db_config=db_config, dry_run=False, today=run_date)
                db_saver.record_run(run_date)
                print(f"[스케줄러] {run_date} 배치 실행 완료")
                ran_any = True
            except Exception as e:
                print(f"[스케줄러] {run_date} 배치 실행 중 오류 발생:\n{traceback.format_exc()}")
                raise RuntimeError(
                    f"{run_date} 배치 실행 실패 - 다음 스케줄에서 이 날짜부터 재시도됩니다"
                ) from e

        if ran_any:
            _precompute_predictions()
    finally:
        DatabaseSaver.release_daily_batch_lock(lock_conn)


def _log_job_error(event) -> None:
    print(f"[스케줄러] job={event.job_id} 실행 실패: {event.exception}")


def start_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone=KST)
    scheduler.add_listener(_log_job_error, EVENT_JOB_ERROR)
    scheduler.add_job(run_daily_batch_job, "cron", hour=0, minute=0, id="daily_update")
    scheduler.start()
    return scheduler