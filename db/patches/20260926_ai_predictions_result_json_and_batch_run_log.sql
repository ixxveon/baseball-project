-- ai_predictions: result_json/recommendation_score(+weather_adjustment) 컬럼 및 테이블 자체 생성
-- batch_run_log: 자정 배치 중복 실행 방지용 테이블 생성
--
-- 두 테이블 모두 FastAPI(AI 분석) 쪽에서만 쓰고 대응하는 JPA 엔티티가 없어서,
-- backend의 Hibernate ddl-auto=update로는 자동 생성되지 않습니다. 그래서 이 파일로 직접 관리합니다.
--
-- CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS 기반이라 여러 번 실행해도 안전합니다.

CREATE TABLE IF NOT EXISTS ai_predictions (
                                              id                   BIGSERIAL PRIMARY KEY,
                                              game_id              BIGINT NOT NULL REFERENCES games (game_id),
    home_win_prob        NUMERIC(5, 2) NOT NULL,
    result_json          JSONB NOT NULL,
    recommendation_score INTEGER NOT NULL,
    weather_adjustment   INTEGER NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
    );

ALTER TABLE ai_predictions
    ADD COLUMN IF NOT EXISTS result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS recommendation_score INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS weather_adjustment INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_ai_predictions_game_id_created_at
    ON ai_predictions (game_id, created_at DESC);

CREATE TABLE IF NOT EXISTS batch_run_log (
                                             run_date DATE PRIMARY KEY
);