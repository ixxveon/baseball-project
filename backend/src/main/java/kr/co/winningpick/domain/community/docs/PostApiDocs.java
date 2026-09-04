package kr.co.winningpick.domain.community.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.community.dto.request.RequestCreatePost;
import kr.co.winningpick.domain.community.dto.response.ResponsePost;

import java.util.List;

@Tag(name = "Post", description = "게시글 관련 API")
public interface PostApiDocs {

    @Operation(summary = "게시글 목록 조회", description = "전체 게시글을 최신순으로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    kr.co.winningpick.global.response.ApiResponse<List<ResponsePost>> getPosts();

    @Operation(summary = "게시글 작성", description = "새 게시글을 작성합니다.")
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
}
