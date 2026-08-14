from fastapi import FastAPI

app = FastAPI(title="WinningPick AI Service")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

# CI 체크 이름 검증용 임시 변경
