
$(function() {
    var update = $("#data_form").length?true:false;
    var prev_index =  null;
    
    function get_selected_tag_eles(ele){
        var tags = $(ele).find(".tags");
        var selected_tags = {};
        var tag_texts = tags.find(".tag-text");
        for(var i=0;i<tag_texts.length;i++){
            var tag_text=$(tag_texts[i]).text().split(".");
            var message = parseInt(tag_text[0])-1;
            selected_tags[message]={
                choice:tag_text[1].charCodeAt(0)-97,
                tag:tag_texts[i]
            };
        }
        return selected_tags;
    }
    function get_selected_tags(ele){
        var selected_tags =  get_selected_tag_eles(ele);
        for(let message_id in selected_tags){
            selected_tags[message_id]=selected_tags[message_id].choice;
        }
        return selected_tags;
    }
    function remove_unwanted_tags(previous, cur){
        let items=$("#messages .list-item");
        if(previous>cur){
            // move up
            var selected_tags =  get_selected_tag_eles(items[cur]);
            for(let message_id in selected_tags){
                if(message_id>=cur){
                    $(selected_tags[message_id].tag.parentNode).remove();
                }
            }
            for(var i=cur+1;i<items.length;i++){
                var selected_tags =  get_selected_tag_eles(items[i]);
                for(let message_id in selected_tags){
                    if(message_id==previous){
                        $(selected_tags[message_id].tag).text((parseInt(cur)+1) + "." +
                        String.fromCharCode(97+selected_tags[message_id].choice));
                    }else if(message_id<previous && message_id>=cur){
                        $(selected_tags[message_id].tag).text((parseInt(message_id)+2) + "." +
                        String.fromCharCode(97+selected_tags[message_id].choice));
                    }
                }
            }
        }else{
            // move down
            for(var i=previous;i<items.length;i++){
                var selected_tags =  get_selected_tag_eles(items[i]);
                for(let message_id in selected_tags){
                    if(message_id==previous){
                        if(i<cur){
                            $(selected_tags[previous].tag.parentNode).remove();
                        }else{
                            $(selected_tags[message_id].tag).text((parseInt(cur)+1) + "." +
                            String.fromCharCode(97+selected_tags[message_id].choice));
                        }
                    }
                    if(message_id>previous && message_id<=cur){
                        $(selected_tags[message_id].tag).text(message_id + "." +
                        String.fromCharCode(97+selected_tags[message_id].choice));
                    }
                }
            }
        }
    }
    function cun_message_block_move(previous, cur){
        let items=$("#messages .list-item");
        if(previous>cur){
            $(items[cur]).insertAfter(items[previous]);
        }else{
            $(items[cur]).insertBefore(items[previous]);
        }
    }
    $("#messages").sortable({
        connectWith: ".list-item",
        handle: ".sort-icon",
        cancel: ".message",
        placeholder: "message choices",
        start: function(event,ui){
            let items=$("#messages .list-item");
            prev_index=items.index(ui.item);
            console.log(event,ui);
        },
        stop: function(event,ui){
            let items=$("#messages .list-item");
            let new_index = items.index(ui.item)
            var error=false;
            if(prev_index>new_index){
                //moved up
                let selected_tags = get_selected_tags(ui.item);
                var error_tags = [];
                for(let message_id in selected_tags){
                    if(parseInt(message_id)>=new_index){
                        error_tags.push((parseInt(message_id)+1) + "." +
                        String.fromCharCode(97+selected_tags[message_id]))
                    }
                }
                if(error_tags.length){
                    error=true;
                    $("#ErrorModelBody").text("The following contition tags in the current message block ("+
                    (prev_index+1) + ") will be removed");
                    let div = $("<div/>");
                    $("#ErrorModelBody").append(div);
                    for(var i=0;i<error_tags.length;i++){
                        let ele = $($("#tag").html());
                        ele.find(".tag-text").text(error_tags[i])
                        div.append(ele)
                    }
                }
            }else if(prev_index<new_index){
                 //moved down
                $("#ErrorModelBody").text("The following message block contition tags will be removed");
                 for(var i=prev_index;i<new_index;i++){
                    let selected_tags = get_selected_tags(items[i]);
                    var error_tags = [];
                    for(let message_id in selected_tags){
                        if(parseInt(message_id)==prev_index){
                            error_tags.push((parseInt(message_id)+1) + "." +
                            String.fromCharCode(97+selected_tags[message_id]))
                        }
                    }
                    if(error_tags.length){
                        error=true;
                        let div = $("<div>Message Block ("+(i+2)+")</div>");
                        for(var j=0;j<error_tags.length;j++){
                            let ele = $($("#tag").html());
                            ele.find(".tag-text").text(error_tags[j])
                            div.append(ele);
                        }
                        $("#ErrorModelBody").append(div);
                    }
                }
            }
            if(error){
                $("#errorContinueBTN").click(function(){
                    remove_unwanted_tags(prev_index, new_index);
                    $("#ErrorModel").modal("hide");
                });
                $("#errorCancelBTN").click(function(){
                    cun_message_block_move(prev_index, new_index);
                    $("#ErrorModel").modal("hide");
                });
                $("#ErrorModel").modal("show");
                
            }else{
                remove_unwanted_tags(prev_index, new_index);
            }
        }
    });
    var editable=function(){
        $("[contenteditable=true]").attr('contenteditable','false').click(editable);
        $(this).attr('contenteditable','true');
        $(this).focus();
        $(this).unbind('click');
    }
    var close_message=function(){
        let item = this.parentNode.parentNode.parentNode;
        let items = $("#messages .list-item");
        let cur = items.index(item)
        var error=false;
        $("#ErrorModelBody").text("The following message block contition tags will be removed");
        for(var i=cur+1;i<items.length;i++){
            let selected_tags = get_selected_tags(items[i]);
            var error_tags = [];
            for(let message_id in selected_tags){
                if(parseInt(message_id)==cur){
                    error_tags.push((parseInt(message_id)+1) + "." +
                    String.fromCharCode(97+selected_tags[message_id]))
                }
            }
            if(error_tags.length){
                error=true;
                var div = $("<div><span>Message Block ("+(i+1)+"): </span></div>");
                $("#ErrorModelBody").append(div);
                for(var j=0;j<error_tags.length;j++){
                    let ele = $($("#tag").html());
                    ele.find(".tag-text").text(error_tags[j]);
                    div.append(ele);
                }
            }
        }
       if(error){
           $("#errorContinueBTN").click(function(){
                for(var i=cur+1;i<items.length;i++){
                    let selected_tags = get_selected_tag_eles(items[i]);
                    for(let message_id in selected_tags){
                        if(parseInt(message_id)==cur){
                            $(selected_tags[message_id].tag.parentNode).remove();
                        }
                    }
                }
               $(item).remove()
               $("#ErrorModel").modal("hide");
           });
           $("#errorCancelBTN").click(function(){
               $("#ErrorModel").modal("hide");
           });
           $("#ErrorModel").modal("show");
           
       }else{
            $(item).remove();
       }
    }
    var close_choice=function(){
        let choice = this.parentNode;
        let item = choice.parentNode.parentNode.parentNode.parentNode;
        let items = $("#messages .list-item");
        let cur = items.index(item)
        let choices = $(choice.parentNode).find(".choice");
        let choice_index = choices.index(choice);
        var error=false;
        $("#ErrorModelBody").text("The following message block contition tags will be removed");
        for(var i=cur+1;i<items.length;i++){
            let selected_tags = get_selected_tags(items[i]);
            var error_tags = [];
            for(let message_id in selected_tags){
                if(parseInt(message_id)==cur && selected_tags[message_id]==choice_index){
                    error_tags.push((parseInt(message_id)+1) + "." +
                    String.fromCharCode(97+selected_tags[message_id]))
                }
            }
            if(error_tags.length){
                error=true;
                var div = $("<div><span>Message Block ("+(i+1)+"): </span></div>");
                $("#ErrorModelBody").append(div);
                for(var j=0;j<error_tags.length;j++){
                    let ele = $($("#tag").html());
                    ele.find(".tag-text").text(error_tags[j]);
                    div.append(ele);
                }
            }
        }
       if(error){
           $("#errorContinueBTN").click(function(){
                for(var i=cur+1;i<items.length;i++){
                    let selected_tags = get_selected_tag_eles(items[i]);
                    for(let message_id in selected_tags){
                        if(parseInt(message_id)==cur){
                            if(selected_tags[message_id].choice==choice_index){
                                $(selected_tags[message_id].tag.parentNode).remove();
                            }else if(selected_tags[message_id].choice>choice_index){
                                $(selected_tags[message_id].tag).text((parseInt(message_id)+1) + "." +
                                String.fromCharCode(96+selected_tags[message_id].choice));
                            }
                        }
                    }
                }
               $(choice).remove()
               $("#ErrorModel").modal("hide");
           });
           $("#errorCancelBTN").click(function(){
               $("#ErrorModel").modal("hide");
           });
           $("#ErrorModel").modal("show");
       }else{
            $(choice).remove();
       }
    }
    function create_choice(choice){
        let ele = $($("#choice").html());
        let choice_text = ele.find(".choice-text");
        if(update){
            choice_text.click(editable);
            ele.find(".close-choice").click(close_choice);
        }
        choice_text.html(choice);
        return ele;
    }
    var add_choice=function(){
        $(this.parentNode).find('.choices').append(create_choice(""));
    }
    var close_tag=function(){
        $(this.parentNode).remove();
    }
    var add_tag=function(){
        var current_message=-1;
        var add_tag_ele = this.parentNode;
        var cur_tag_ele = null;
        if($(this).hasClass("tag-text")){
            current_message = parseInt($(this).text().split("."))-1;
            add_tag_ele = this.parentNode.parentNode.parentNode;
            cur_tag_ele = this;
        }
        $("#tagModelBody").text("");
        var list_items=$(add_tag_ele.parentNode.parentNode.parentNode).prevAll().clone().get().reverse();
        var selected_tags = get_selected_tags(add_tag_ele);
        for(var i=0;i<list_items.length;i++){
            var choices = $(list_items[i]).find(".choice");
            if(i in selected_tags){
                $(list_items[i]).addClass("selected-message");
                $(list_items[i]).attr("data-choice", String.fromCharCode(97+selected_tags[i]));
                for(var j=0;j<choices.length;j++){
                    if(selected_tags[i]==j){
                        $(choices[j]).addClass("selected-choice");
                        $('<i class="material-icons selected">done</i>').insertBefore($(choices[j]).find(".choice-text"));
                    }
                }
            }
            if(!(i in selected_tags)||current_message==i){
                $(list_items[i]).addClass("selectable-message");
                for(var j=0;j<choices.length;j++){
                    $(choices[j]).data("choice", (i+1)+"."+String.fromCharCode(97+j));
                    $(choices[j]).click(function(){
                        let choice_data = $(this).data("choice");
                        let tag_title = choice_data +" "+ $(this).find(".choice-text").text();
                        if(cur_tag_ele){
                            $(cur_tag_ele).text(choice_data).prop('title', tag_title);
                        }else{
                            let ele = $($("#tag").html());
                            ele.find(".tag-text").text(choice_data).prop('title', tag_title).click(add_tag);
                            ele.find(".close-tag").click(close_tag);
                            $(add_tag_ele).find(".tags").append(ele);
                        }
                        $("#tagModel").modal("hide");
                    });
                }
            }
        }
        $("#tagModelBody").append(list_items);
        $("#tagModel").modal("show");
    }
    function create_message(message, choices, selected_tags){
        let ele = $($("#message").html());
        let message_text = ele.find(".message-text");
        message_text.html(message);
        if(update){
            message_text.click(editable);
            ele.find(".close-message").click(close_message);
            ele.find(".btn-add-choice").click(add_choice);
            ele.find(".add-tag").click(add_tag);
        }
        for(var i=0;i<choices.length;i++){
            ele.find(".choices").append(create_choice(choices[i]));
        }
        let tags=ele.find(".tags");
        for(let message_id in selected_tags){
            let choice = selected_tags[message_id];
            let choice_data = (parseInt(message_id)+1)+"."+String.fromCharCode(97+choice);
            let tag_title = choice_data +" "+ $("<div>"+original_messages[message_id].choices[choice]+"</div>").find(".choice-text").text();
            let ele = $($("#tag").html());
            let tag_text=ele.find(".tag-text");
            tag_text.text(choice_data).prop('title', tag_title);
            if(update){
                tag_text.click(add_tag);
                ele.find(".close-tag").click(close_tag);
            }
            tags.append(ele);
        }
        return ele;
    }
    $("#data_form").on('submit', function(){
        $(".error").text("");
        var message_blocks = $("#messages .message");
        var error=false;
        if($("#name").val().trim()==""){
            $("#name-error").text("Name can't be Empty");
            error=true;
        }
        var messages = [];
        for(var i=0;i<message_blocks.length;i++){
            var message = {};
            var message_block = message_blocks[i];
            if($(message_block).find(".message-text").text().trim()||$(message_block).find(".message-text img").length){
                message["message"]=$(message_block).find(".message-text").html();
            }else{
                $(message_block).find(".message-error").text("Message can't be empty")
                error=true;
            }
            var choices_blocks = $(message_block).find(".choice");
            var choices = [];
            message["choices"] = choices;
            for(var j=0;j<choices_blocks.length;j++){
                var choice_block = choices_blocks[j];
                if($(choice_block).find(".choice-text").text().trim()||$(choice_block).find(".choice-text img").length){
                    choices.push($(choice_block).find(".choice-text").html());
                }else{
                    $(choice_block).find(".choice-error").text("Choice can't be empty")
                    error=true;
                }
            }
            let selected_tags = get_selected_tags(message_block);
            message["selected_tags"]=selected_tags;
            for(var j=messages.length-1;j>=0;j--){
                let jth_message = messages[j];
                if(jth_message.choices.length==0){
                    var not_reachable=true;
                    for(let message_id in jth_message.selected_tags){
                        if(selected_tags[message_id]!=jth_message.selected_tags[message_id]){
                            not_reachable=false;
                        }
                    }
                    if(not_reachable){
                        let error_msg_ele = $(message_block).find(".message-error");
                        var error_message = error_msg_ele.text();
                        if(error_message){
                            error_message = error_message + " & ";
                        }
                        error_message = error_message + "Message Block "+(j+1)+" is blocking the flow";
                        error_msg_ele.text(error_message);
                        error=true;
                        break;
                    }
                }
            }
            messages.push(message);
        }
        $("#id_messages").val(JSON.stringify(messages));
        return !error;
    });
    var original_messages=JSON.parse($("#id_messages").val());
    if(original_messages===""){
        create_message("", ["", ""], {}).insertBefore(".btn-add-message");
    }else{
        for(var i=0;i<original_messages.length;i++){
            create_message(original_messages[i]["message"], original_messages[i]["choices"], original_messages[i]["selected_tags"]).insertBefore(".btn-add-message")
        }
    }
    if(update){
        $(".btn-add-message").click(function(){
            create_message("", ["", ""], {}).insertBefore(this);
        });
    }
});