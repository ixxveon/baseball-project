package kr.co.winningpick.domain.community.repository;

import kr.co.winningpick.domain.community.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.data.domain.Pageable;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p, (SELECT COUNT(c) FROM Comment c WHERE c.post.id = p.id) " +
            "FROM Post p JOIN FETCH p.author WHERE p.id = :id")
    List<Object[]> findByIdWithAuthorAndCommentCount(@Param("id") Long id);

    @Query(
            value = "SELECT p, (SELECT COUNT(c) FROM Comment c WHERE c.post = p) " +
                    "FROM Post p JOIN FETCH p.author " +
                    "WHERE (:gameId IS NULL OR p.gameId = :gameId) " +
                    "ORDER BY p.createdAt DESC",
            countQuery = "SELECT COUNT(p) FROM Post p WHERE (:gameId IS NULL OR p.gameId = :gameId)"
    )
    Page<Object[]> findAllWithAuthorAndCommentCount(@Param("gameId") Long gameId, Pageable pageable);
}
