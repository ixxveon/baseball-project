package kr.co.winningpick.domain.community.repository;

import kr.co.winningpick.domain.community.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(
            value = "SELECT c FROM Comment c JOIN FETCH c.author WHERE c.post.id = :postId ORDER BY c.createdAt ASC",
            countQuery = "SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId"
    )
    Page<Comment> findAllByPostIdWithAuthor(@Param("postId") Long postId, Pageable pageable);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.post.id = :postId")
    void deleteAllByPostId(@Param("postId") Long postId);
}
