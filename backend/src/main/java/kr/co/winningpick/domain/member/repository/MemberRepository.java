package kr.co.winningpick.domain.member.repository;

import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.type.ProviderType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    Optional<Member> findByEmail(String email);

    Optional<Member> findBySocialIdAndProvider(String socialId, ProviderType provider);
}
