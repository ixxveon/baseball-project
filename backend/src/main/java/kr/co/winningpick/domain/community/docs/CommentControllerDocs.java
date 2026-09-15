package kr.co.winningpick.domain.community.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.community.dto.request.RequestCreateComment;
import kr.co.winningpick.domain.community.dto.response.ResponseComment;

import java.util.List;

@Tag(name = "Comment", description = "댓글 관련 API")
public interface CommentControllerDocs {

    @Operation(summary = "댓글 목록 조회", description = "게시글에 달린 댓글을 작성일시 오름차순으로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 게시글",
                    content = @Content(examples = @ExampleObject(value = """
                            {"success":false,"message":"게시글을 찾을 수 없습니다","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<List<ResponseComment>> getComments(Long postId);

    @Operation(summary = "댓글 작성", description = "게시글에 댓글을 작성합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "작성 성공"),
            @ApiResponse(responseCode = "400", description = "요청값 검증 실패 (content 누락)"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 게시글",
                    content = @Content(examples = @ExampleObject(value = """
                            {"success":false,"message":"게시글을 찾을 수 없습니다","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponseComment> createComment(Long postId, Long userId, RequestCreateComment request);

    @Operation(summary = "댓글 삭제", description = "본인이 작성한 댓글을 삭제합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "403", description = "본인 댓글이 아님"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 댓글")
    })
    kr.co.winningpick.global.response.ApiResponse<Void> deleteComment(Long postId, Long commentId, Long memberId);
}
