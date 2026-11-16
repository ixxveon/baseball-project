import base64
import hashlib
import hmac
import json

from core.auth import verify_access_token

SECRET = "test-secret-key-that-is-long-enough-for-hmac-sha-512-signing-0123456789"
NOW = 1_800_000_000


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _make_token(payload: dict, alg: str = "HS512", secret: str = SECRET) -> str:
    header = _b64(json.dumps({"alg": alg}).encode())
    body = _b64(json.dumps(payload).encode())
    signing_input = f"{header}.{body}".encode("ascii")
    hash_function = {"HS256": hashlib.sha256, "HS384": hashlib.sha384, "HS512": hashlib.sha512}[alg]
    signature = _b64(hmac.new(secret.encode(), signing_input, hash_function).digest())
    return f"{header}.{body}.{signature}"


def test_valid_token_returns_member_id():
    token = _make_token({"sub": "7", "exp": NOW + 60})
    assert verify_access_token(token, SECRET, now=NOW) == 7


def test_supports_hs256_and_hs384():
    for alg in ("HS256", "HS384"):
        token = _make_token({"sub": "3", "exp": NOW + 60}, alg=alg)
        assert verify_access_token(token, SECRET, now=NOW) == 3


def test_wrong_secret_is_rejected():
    token = _make_token({"sub": "7", "exp": NOW + 60}, secret="another-secret")
    assert verify_access_token(token, SECRET, now=NOW) is None


def test_expired_token_is_rejected():
    token = _make_token({"sub": "7", "exp": NOW - 1})
    assert verify_access_token(token, SECRET, now=NOW) is None


def test_tampered_payload_is_rejected():
    token = _make_token({"sub": "7", "exp": NOW + 60})
    header, _, signature = token.split(".")
    forged_body = _b64(json.dumps({"sub": "1", "exp": NOW + 60}).encode())
    assert verify_access_token(f"{header}.{forged_body}.{signature}", SECRET, now=NOW) is None


def test_alg_none_is_rejected():
    header = _b64(json.dumps({"alg": "none"}).encode())
    body = _b64(json.dumps({"sub": "7", "exp": NOW + 60}).encode())
    assert verify_access_token(f"{header}.{body}.", SECRET, now=NOW) is None


def test_malformed_token_is_rejected():
    assert verify_access_token("not-a-jwt", SECRET, now=NOW) is None
    assert verify_access_token("a.b.c", SECRET, now=NOW) is None
