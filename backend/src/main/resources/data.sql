-- 로컬 개발용 시드 데이터.
-- 명시적으로 큰 id(9001~)를 사용하고 ON CONFLICT DO NOTHING으로 감싸서,
-- 매 부팅마다 실행돼도(spring.sql.init.mode=always) 이미 있으면 건너뛰고 실사용 데이터는 건드리지 않는다.

INSERT INTO users (id, email, nickname, provider, password, push_alarm_enabled, created_at, updated_at)
VALUES
    (9001, 'seed.user1@winningpick.seed', '직관러버', 'LOCAL', NULL, false, now(), now()),
    (9002, 'seed.user2@winningpick.seed', '불펜은진리', 'LOCAL', NULL, false, now(), now()),
    (9003, 'seed.user3@winningpick.seed', '치맥필수', 'LOCAL', NULL, false, now(), now()),
    (9004, 'seed.user4@winningpick.seed', '9회말영웅', 'LOCAL', NULL, false, now(), now()),
    (9005, 'seed.user5@winningpick.seed', '외야직관러', 'LOCAL', NULL, false, now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO community_posts (post_id, game_id, user_id, category, title, content, created_at, updated_at)
VALUES
    (9001, 1, 9001, 'PREVIEW', '오늘 선발 라인업 뜸', '오늘 선발투수 컨디션 좋아보이던데 기대해도 될까요? 불펜도 요즘 안정적이라 믿고 갑니다', now() - interval '1 day', now() - interval '1 day'),
    (9002, 1, 9002, 'CERTIFICATION', '오늘도 직관 다녀왔습니다', '3루측 응원석에서 봤는데 분위기 진짜 미쳤어요 다들 목 아프실듯ㅋㅋ 오늘 승리 요정 제가 한듯', now() - interval '1 day', now() - interval '1 day'),
    (9003, 1, 9003, 'ETC', '경기 전 치맥 뭐 드세요', '저는 무조건 후라이드+생맥인데 다른 분들은 어떤 조합 좋아하시나요 추천 받습니다', now() - interval '2 day', now() - interval '2 day'),
    (9004, 1, 9004, 'PREVIEW', '오늘 선발투수 상대 전적 어떤가요', '지난번에 상대할 때 털렸던 기억이 있어서 좀 불안하네요 오늘은 다를 거라 믿습니다', now() - interval '2 day', now() - interval '2 day'),
    (9005, 1, 9005, 'CERTIFICATION', '외야석 직관 후기 남깁니다', '오늘 처음으로 외야에서 봤는데 파울볼 잡을 뻔했어요 진짜 아쉬웠습니다 다음엔 꼭 잡는다', now() - interval '3 day', now() - interval '3 day'),
    (9006, 1, 9001, 'ETC', '요즘 팀 분위기 어떤가요', '연패 끊고 나서 선수들 표정이 확실히 밝아진 것 같아요 이 기세 계속 이어갔으면 좋겠네요', now() - interval '3 day', now() - interval '3 day'),
    (9007, 1, 9002, 'PREVIEW', '오늘 경기 예상 스코어 맞춰보기', '저는 5대3으로 조심스럽게 예상해봅니다 다들 몇 대 몇으로 예상하세요?', now() - interval '4 day', now() - interval '4 day'),
    (9008, 1, 9003, 'CERTIFICATION', '어제 끝내기 직관러 지나갑니다', '9회말 2아웃에서 그 역전 끝내기 실제로 보니까 소름 돋았어요 직관 성지 인증합니다', now() - interval '4 day', now() - interval '4 day'),
    (9009, 1, 9004, 'ETC', '유니폼 세탁 어떻게 하세요', '땀 많이 흘리고 온 유니폼 세탁법 공유 좀 해주세요 자꾸 목 늘어나는 것 같아서요', now() - interval '5 day', now() - interval '5 day'),
    (9010, 1, 9005, 'PREVIEW', '불펜 컨디션 걱정되네요', '요 며칠 계속 등판해서 좀 지쳐보이던데 오늘은 좀 쉬어갔으면 하는 바람입니다', now() - interval '5 day', now() - interval '5 day'),
    (9011, 1, 9001, 'CERTIFICATION', '주말 직관 다녀온 후기', '주말이라 그런지 사람 진짜 많더라고요 매진 인증하고 갑니다 표 구하시려면 서두르세요', now() - interval '6 day', now() - interval '6 day'),
    (9012, 1, 9002, 'ETC', '올 시즌 최고의 명장면 뭐였나요', '개인적으로는 끝내기 홈런이었는데 다른 분들 생각도 궁금하네요 댓글로 알려주세요', now() - interval '6 day', now() - interval '6 day'),
    (9013, 1, 9003, 'PREVIEW', '신인 선발 데뷔전 기대되네요', '오늘 첫 선발 등판이라던데 긴장 많이 될 것 같아요 잘 던졌으면 좋겠습니다 화이팅', now() - interval '7 day', now() - interval '7 day'),
    (9014, 1, 9004, 'CERTIFICATION', '1루측 직관 꿀팁 공유', '1루측 앉으니까 수비 보기 편하더라고요 입장은 조금 일찍 하시는 걸 추천드립니다', now() - interval '7 day', now() - interval '7 day'),
    (9015, 1, 9005, 'ETC', '경기 없는 날 뭐하세요', '오늘 경기 없는 날인데 다들 뭐하고 지내세요 저는 하이라이트 영상 돌려보고 있습니다', now() - interval '8 day', now() - interval '8 day'),
    (9016, 1, 9001, 'PREVIEW', '오늘 타순 좀 바뀐 것 같은데', '상위타선 순서 바뀐 거 보고 감독님 의도가 궁금해지네요 오늘 경기 보면서 확인해봐야겠어요', now() - interval '8 day', now() - interval '8 day')
ON CONFLICT (post_id) DO NOTHING;

INSERT INTO community_comments (comment_id, post_id, user_id, content, created_at)
VALUES
    (9001, 9001, 9002, '저도 기대돼요! 오늘 느낌 좋습니다', now() - interval '1 day'),
    (9002, 9001, 9003, '불펜 최근 방어율 진짜 좋아졌더라고요', now() - interval '1 day'),
    (9003, 9002, 9001, '저도 3루측이었는데 진짜 목 다 쉬었어요ㅋㅋ', now() - interval '1 day'),
    (9004, 9002, 9004, '부럽습니다 저는 오늘 직관 못 가서 아쉽네요', now() - interval '1 day'),
    (9005, 9002, 9005, '오늘 이긴 거 실화인가요 축하드려요', now() - interval '1 day'),
    (9006, 9003, 9001, '저는 양념치킨파입니다 은근 잘 어울려요', now() - interval '2 day'),
    (9007, 9003, 9004, '역시 후라이드가 국룰이죠', now() - interval '2 day'),
    (9008, 9004, 9002, '오늘은 다를 거예요 믿어봅시다', now() - interval '2 day'),
    (9009, 9005, 9003, '파울볼 다음엔 꼭 잡으시길 바랍니다ㅎㅎ', now() - interval '3 day'),
    (9010, 9006, 9002, '분위기 좋아진 거 확실히 느껴지네요', now() - interval '3 day'),
    (9011, 9006, 9005, '이 기세 쭉 갔으면 좋겠어요', now() - interval '3 day'),
    (9012, 9007, 9003, '저는 4대2로 예상해봅니다', now() - interval '4 day'),
    (9013, 9007, 9005, '스코어 예측 재밌네요 저도 껴봅니다 6대4', now() - interval '4 day'),
    (9014, 9008, 9001, '그 장면 하이라이트로 몇 번을 돌려봤는지 몰라요', now() - interval '4 day'),
    (9015, 9008, 9004, '직관 성지 인정합니다ㅋㅋㅋ', now() - interval '4 day'),
    (9016, 9009, 9005, '찬물 세탁하고 그늘에 말리면 좀 낫더라고요', now() - interval '5 day'),
    (9017, 9011, 9002, '매진이라니 진짜 인기 실감나네요', now() - interval '6 day'),
    (9018, 9012, 9003, '저도 그 끝내기 홈런 잊지 못해요', now() - interval '6 day'),
    (9019, 9013, 9001, '신인 선수 화이팅입니다 잘 던지길', now() - interval '7 day'),
    (9020, 9014, 9005, '1루측 팁 감사합니다 다음에 시도해볼게요', now() - interval '7 day')
ON CONFLICT (comment_id) DO NOTHING;
