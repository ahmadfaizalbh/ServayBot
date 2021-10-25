$(function() {
    var select_choice = function(){
      $(".choice").unbind("click");
      var block_html = $("#message_block").html();
      var block = $(block_html);
      block.addClass("client");
      block.find(".message").html($(this).html())
      $("#chat_block").append(block);
        $.post(window.location, {answer:$(this).data("choice-id")}, function( data ) {
          var message = data.message;
          var block = $(block_html)
          block.addClass(message.bot?"bot":"client");
          block.find(".message").html(message.message);
          var choices_ol = block.find("choices");
          var choices = message.choices||[];
          for(var i=0;i<choices.length;i++){
            var li = $($("#choice").html());
            li.data("choice-id", i);
            li.click(select_choice);
            choices_ol.append(li);
          }
          $("#chat_block").append(block);
        });
    }
    $('.message_block:last').find("li.choice").click(select_choice);
}); 