-- 로컬 개발용 시드 데이터.
-- 명시적으로 큰 id(9001~)를 사용하고 ON CONFLICT DO NOTHING으로 감싸서,
-- 매 부팅마다 실행돼도(spring.sql.init.mode=always) 이미 있으면 건너뛰고 실사용 데이터는 건드리지 않는다.

INSERT INTO users (id, email, nickname, provider, password, push_alarm_enabled, created_at, updated_at)
VALUES
    (9001, 'seed.author@winningpick.seed', '시드유저', 'LOCAL', NULL, false, now(), now()),
    (9002, 'seed.commenter@winningpick.seed', '시드댓글러', 'LOCAL', NULL, false, now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO community_posts (post_id, game_id, user_id, category, title, content, created_at, updated_at)
VALUES
    (9001, 1, 9001, 'PREVIEW', '오늘 경기 프리뷰입니다', '선발 라인업 보니까 기대되네요', now(), now()),
    (9002, 1, 9001, 'CERTIFICATION', '직관 인증합니다', '오늘 직관 다녀왔어요, 분위기 최고였습니다', now(), now()),
    (9003, 1, 9001, 'ETC', '자유롭게 얘기해요', '아무 얘기나 편하게 남겨주세요', now(), now())
ON CONFLICT (post_id) DO NOTHING;

INSERT INTO community_comments (comment_id, post_id, user_id, content, created_at)
VALUES
    (9001, 9001, 9002, '저도 기대돼요!', now()),
    (9002, 9002, 9002, '부럽습니다 ㅎㅎ', now())
ON CONFLICT (comment_id) DO NOTHING;
