import pytest
from fastapi.testclient import TestClient

from main import app
from service.api import prediction_router
from service.schemas.prediction_schema import RecentRecordSchema

# 실제 라우터 등록 경로에 맞게 수정하세요 (api_router 안에서 prediction_router가 붙는 위치 기준)
PREFIX = "/api/v1/ai"

# lifespan(스케줄러)이 실행되지 않도록 with 문 없이 생성, 500 핸들러 검증을 위해 서버 예외를 그대로 올리지 않음
client = TestClient(app, raise_server_exceptions=False)


def assert_error_format(body: dict):
    assert set(body.keys()) == {"success", "message", "data"}
    assert body["success"] is False
    assert body["data"] is None


# ---------- 문서(/openapi.json) ----------

def test_docs_have_summary_and_description():
    spec = client.get("/openapi.json").json()
    for path, method in [
        (f"{PREFIX}/teams/{{team_id}}/recent-record", "get"),
        (f"{PREFIX}/games", "get"),
        (f"{PREFIX}/predict", "post"),
    ]:
        op = spec["paths"][path][method]
        assert op.get("summary")
        assert op.get("description")


def test_prepare_prompt_hidden_from_docs():
    spec = client.get("/openapi.json").json()
    assert f"{PREFIX}/prepare-prompt" not in spec["paths"]


def test_error_examples_in_docs():
    spec = client.get("/openapi.json").json()
    responses = spec["paths"][f"{PREFIX}/predict"]["post"]["responses"]
    assert "400" in responses
    assert "422" in responses
    assert "500" in responses


# ---------- 정상 응답 ----------

def test_success_response_has_no_status(monkeypatch):
    fake = RecentRecordSchema(
        wins=6, losses=4, gamesCount=10, winRate=60, avgScored=5.1, avgAllowed=4.2
    )
    monkeypatch.setattr(
        prediction_router.prediction_service,
        "get_recent_team_record",
        lambda team_id: fake,
    )

    res = client.get(f"{PREFIX}/teams/1/recent-record")

    assert res.status_code == 200
    body = res.json()
    assert set(body.keys()) == {"success", "message", "data"}
    assert body["success"] is True
    assert body["data"]["wins"] == 6


# ---------- 에러 응답 ----------

def test_value_error_returns_400(monkeypatch):
    def raise_value_error(game_id):
        raise ValueError("경기를 찾을 수 없습니다.")

    monkeypatch.setattr(prediction_router.prediction_service, "predict", raise_value_error)

    res = client.post(f"{PREFIX}/predict", json={"gameId": 999})

    assert res.status_code == 400
    assert_error_format(res.json())
    assert res.json()["message"] == "경기를 찾을 수 없습니다."


def test_missing_game_id_returns_422():
    res = client.post(f"{PREFIX}/predict", json={})

    assert res.status_code == 422
    assert_error_format(res.json())


def test_unknown_path_returns_404_in_same_format():
    res = client.get("/api/v1/not-exist")

    assert res.status_code == 404
    assert_error_format(res.json())


def test_unhandled_exception_returns_500(monkeypatch):
    def boom(game_id):
        raise RuntimeError("unexpected")

    monkeypatch.setattr(prediction_router.prediction_service, "predict", boom)

    res = client.post(f"{PREFIX}/predict", json={"gameId": 1})

    assert res.status_code == 500
    assert_error_format(res.json())


# ---------- 숨김 API는 호출 가능해야 함 ----------

def test_prepare_prompt_still_callable(monkeypatch):
    def raise_value_error(game_id):
        raise ValueError("x")

    monkeypatch.setattr(
        prediction_router.prediction_service, "prepare_matchup_prompt", raise_value_error
    )

    res = client.post(f"{PREFIX}/prepare-prompt", json={"gameId": 1})

    assert res.status_code == 400  # 404가 아니면 라우트는 살아있는 것