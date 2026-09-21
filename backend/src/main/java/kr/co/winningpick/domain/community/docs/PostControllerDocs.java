package kr.co.winningpick.domain.community.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.community.dto.request.RequestCreatePost;
import kr.co.winningpick.domain.community.dto.request.RequestUpdatePost;
import kr.co.winningpick.domain.community.dto.response.ResponsePost;
import kr.co.winningpick.global.response.ResponsePage;
import org.springframework.data.domain.Pageable;

@Tag(name = "Post", description = "게시글 관련 API")
public interface PostControllerDocs {

    @Operation(summary = "게시글 목록 조회", description = "게시글을 페이지 단위로 조회합니다. gameId를 주면 그 경기 게시글만 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    kr.co.winningpick.global.response.ApiResponse<ResponsePage<ResponsePost>> getPosts(Long gameId, Pageable pageable);

    @Operation(summary = "게시글 작성", description = "새 게시글을 작성합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "작성 성공"),
            @ApiResponse(responseCode = "400", description = "요청값 검증 실패 (title/content 누락 등)"),
            @ApiResponse(responseCode = "401", description = "존재하지 않는 작성자(userId)",
                    content = @Content(examples = @ExampleObject(value = """
                            {"success":false,"message":"이메일 또는 비밀번호가 올바르지 않습니다.","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponsePost> createPost(Long userId, RequestCreatePost request);

    @Operation(summary = "게시글 상세 조회", description = "게시글 ID로 단건 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 게시글",
                    content = @Content(examples = @ExampleObject(value = """
                            {"success":false,"message":"게시글을 찾을 수 없습니다","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponsePost> getPost(Long id);

    @Operation(summary = "게시글 수정", description = "본인이 작성한 게시글을 수정합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "요청값 검증 실패"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(examples = @ExampleObject(value = """
                    {"success":false,"message":"인증이 필요합니다","data":null}""")))    ,
            @ApiResponse(responseCode = "403", description = "본인 게시글이 아님",
                    content = @Content(examples = @ExampleObject(value = """
                    {"success":false,"message":"본인 게시글만 수정/삭제할 수 있습니다","data":null}""")))    ,
            @ApiResponse(responseCode = "404", description = "존재하지 않는 게시글",
                    content = @Content(examples = @ExampleObject(value = """
                    {"success":false,"message":"게시글을 찾을 수 없습니다","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponsePost> updatePost(Long id, Long memberId, RequestUpdatePost request);

    @Operation(summary = "게시글 삭제", description = "본인이 작성한 게시글을 삭제합니다. 딸린 댓글도 함께 삭제됩니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(examples = @ExampleObject(value = """
                    {"success":false,"message":"인증이 필요합니다","data":null}""")))    ,
            @ApiResponse(responseCode = "403", description = "본인 게시글이 아님"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 게시글")
    })
    kr.co.winningpick.global.response.ApiResponse<Void> deletePost(Long id, Long memberId);

}
