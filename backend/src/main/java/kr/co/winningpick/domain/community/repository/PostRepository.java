package kr.co.winningpick.domain.community.repository;

import kr.co.winningpick.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p, (SELECT COUNT(c) FROM Comment c WHERE c.post = p) " +
           "FROM Post p JOIN FETCH p.author ORDER BY p.createdAt DESC")
    List<Object[]> findAllWithAuthorAndCommentCountOrderByCreatedAtDesc();

    @Query("SELECT p, (SELECT COUNT(c) FROM Comment c WHERE c.post = p) " +
           "FROM Post p JOIN FETCH p.author WHERE p.id = :id")
    List<Object[]> findByIdWithAuthorAndCommentCount(@Param("id") Long id);
}
