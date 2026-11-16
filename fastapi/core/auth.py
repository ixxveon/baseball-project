"""Spring이 발급한 액세스 토큰(JWT)을 검증한다.

Spring은 jjwt의 Keys.hmacShaKeyFor(secret.getBytes())로 서명하므로,
키 길이에 따라 HS256 / HS384 / HS512 중 하나가 쓰인다. 헤더의 alg를 보고 같은 해시로 검증한다.
"""

import base64
import hashlib
import hmac
import json
import time
from typing import Any

from core.config import settings

_HASH_BY_ALGORITHM = {
    "HS256": hashlib.sha256,
    "HS384": hashlib.sha384,
    "HS512": hashlib.sha512,
}

_BEARER_PREFIX = "Bearer "


def _b64url_decode(segment: str) -> bytes:
    padding = "=" * (-len(segment) % 4)
    return base64.urlsafe_b64decode(segment + padding)


def _decode_json(segment: str) -> dict[str, Any] | None:
    try:
        decoded = json.loads(_b64url_decode(segment))
    except (ValueError, json.JSONDecodeError):
        return None
    return decoded if isinstance(decoded, dict) else None


def verify_access_token(token: str, secret: str, now: float | None = None) -> int | None:
    """서명과 만료가 유효하면 회원 ID(sub)를, 아니면 None을 반환한다."""
    parts = token.split(".")
    if len(parts) != 3:
        return None

    header_segment, payload_segment, signature_segment = parts
    header = _decode_json(header_segment)
    if header is None:
        return None

    hash_function = _HASH_BY_ALGORITHM.get(header.get("alg"))
    if hash_function is None:
        return None

    signing_input = f"{header_segment}.{payload_segment}".encode("ascii")
    expected = hmac.new(secret.encode("utf-8"), signing_input, hash_function).digest()
    try:
        actual = _b64url_decode(signature_segment)
    except ValueError:
        return None
    if not hmac.compare_digest(expected, actual):
        return None

    payload = _decode_json(payload_segment)
    if payload is None:
        return None

    expires_at = payload.get("exp")
    current = time.time() if now is None else now
    if not isinstance(expires_at, (int, float)) or expires_at <= current:
        return None

    try:
        return int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        return None


def member_id_from_authorization(authorization: str | None) -> int | None:
    """Authorization 헤더에서 로그인 회원 ID를 꺼낸다. 비로그인이거나 토큰이 유효하지 않으면 None."""
    if not authorization or not authorization.startswith(_BEARER_PREFIX):
        return None
    if not settings.jwt_secret:
        # 서명 키가 없으면 누구도 로그인 사용자로 인정하지 않는다 (신규 분석 생성 차단)
        return None
    return verify_access_token(authorization[len(_BEARER_PREFIX):], settings.jwt_secret)
