from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "WinningPick AI Service"

    pg_host: str = Field("localhost", alias="PGHOST")
    pg_port: str = Field("5432", alias="PGPORT")
    pg_dbname: str = Field("winningpick", alias="PGDATABASE")
    pg_user: str = Field("postgres", alias="PGUSER")
    pg_password: str | None = Field(None, alias="PGPASSWORD")

    openweather_api_key: str | None = Field(None, alias="OPENWEATHER_API_KEY")

    cors_allow_origins: str = Field("http://localhost:5173", alias="CORS_ALLOW_ORIGINS")

    @property
    def cors_allow_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]

    def require_pg_password(self) -> str:
        if not self.pg_password:
            raise RuntimeError("필수 환경변수 PGPASSWORD가 설정되지 않았습니다.")
        return self.pg_password

    def require_openweather_api_key(self) -> str:
        if not self.openweather_api_key:
            raise RuntimeError("필수 환경변수 OPENWEATHER_API_KEY가 설정되지 않았습니다.")
        return self.openweather_api_key

    def db_config(self) -> dict[str, str]:
        return {
            "host": self.pg_host,
            "port": self.pg_port,
            "dbname": self.pg_dbname,
            "user": self.pg_user,
            "password": self.require_pg_password(),
        }

    def db_dsn(self) -> str:
        return (
            f"host={self.pg_host} "
            f"port={self.pg_port} "
            f"dbname={self.pg_dbname} "
            f"user={self.pg_user} "
            f"password={self.require_pg_password()}"
        )


settings = Settings()