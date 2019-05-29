$(function () {
  function buildHTML(message) {
    var imagehtml = message.image == null ? "" : `<img src="${message.image}" class="lower-message__image">`
    var html = `<div class=message>
                    <div class="upper-message">
                      <div class="upper-message__user-name">
                      ${message.user_name}
                      </div>
                      <div class="upper-message__date">
                      ${message.created_at}
                      </div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message__content">
                      ${message.content}
                      </p>
                      ${imagehtml}
                    </div>
                  </div> `
    return html;
  }

  $('#new_message').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })

      .done(function (data) {
        var html = buildHTML(data);
        $('.messages').append(html);
        $('.form__submit').prop("disabled", false);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
        $("form")[0].reset();
      })

      .fail(function () {
        alert('メッセージの送信に失敗しました');
      })
    return false;
  });

  var reloadMessages = setInterval(function () {
    var last_message_id = $('.message').last().data('id');
    var group_id = $('.left-header').data('group');
    if (window.location.pathname.match(/\/groups\/\d+\/messages/)) {
      $.ajax({
        url: `/groups/${group_id}/api/messages`,
        type: "get",
        data: { id: last_message_id },
        dataType: "json"
      })
        .done(function (data) {
          data.forEach(function (message) {
            var html = buildHTML(message);
            $('.messages').append(html);
            $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
          });
        })
        .fail(function () {
          alert('自動更新に失敗しました');
        });
    } else {
      clearInterval(reloadMessages);
    }
  }, 5000);

});