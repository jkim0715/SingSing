$(document).on('click', '#postNew', function () {
    console.log("여기야여기");
    print("dd");
})


$(document).on('click', '.deletePost', function () {
    var post_id = $(this).data('id');
    $.ajax({
        url: '{% url "delete_post" %}',
        method: 'POST',
        data: {
            post_id: post_id,
            csrfmiddlewaretoken: '{{csrf_token}}'
        },
        success: function (data) {
            alert('삭제성공');
            $('#post-' + data.post_id).remove();
        },
        error: function (data) {
            alert('삭제실패');
        }
    })
})


$(document).on('click', '.commentDelete', function () {
    var comment_id = $(this).data('id');
    $.ajax({
        url: "{% url 'comment_delete' %}",
        method: 'POST',
        data: {
            comment_id: comment_id,
            csrfmiddlewaretoken: '{{csrf_token}}'
        },
        success: function (data) {
            alert('삭제성공');
            $('#comment-' + data.comment_id).remove();
        },
        error: function (data) {
            alert('삭제실패');
        }
    })

})


$(document).on('click', '.commentBox', function () {
    var post_id = $(this).data('value');

    var bool = $("#commentBox-" + post_id).is(":hidden");
    $("#commentBox-" + post_id).toggleClass('hidden');
    $("#commentBox-" + post_id).attr('hidden', !bool);
})


$(document).on('submit', ".commentForm", function (e) {
    event.preventDefault();
    var post_id = $(this).data('value');

    console.log(post_id);
    var comment = $('#commentInput-' + post_id).val();
    $('#commentInput-' + post_id).val(' ');
    $.ajax({
        url: '{% url "comment" %}',
        method: 'POST',
        data: {
            comment: comment,
            post_id: post_id,
            csrfmiddlewaretoken: '{{csrf_token}}'
        },
        success: function (data) {
            var element =
            `
                <li class="list-group-item" id="comment-${data.comment_id}">
                    <div class="text-right">
                        ${data.content}
                    <span><i class="far fa-trash-alt commentDelete" data-id="${data.comment_id}"></i></span>
                    </div>
                </li>                                        
            `
            $('.comment-' + post_id).prepend(element);

        },
        error: function (data) {
            // console.log(data);
            if (data.status == 401) location.href = "{% url 'accounts:login' %}"
        }
    })


})