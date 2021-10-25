from django.http.response import JsonResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from webapp.models.chatbot_template import ChatbotTemplate
from webapp.models.conversation import Conversation
from webapp.models.session import Session
from django.views.decorators.csrf import csrf_exempt

END_MESSAGE = "Thank you for partispating, you can close the window"

def get_next_message(session, template, answer=None):
    data = session.data
    messages = template.messages
    message_id = data.get("message_id", -1)
    if answer is not None and message_id>=0:
        data["answers"][str(message_id)] = answer
        Conversation.objects.create(session=session, message={
            "message":messages[message_id]["choices"][answer]
        }, bot=False)
    next_message_id = message_id + 1
    for next_message_id, message in enumerate(messages[next_message_id:], start=next_message_id):
        if all((choice==data.get("answers", {}).get(msg_id)) for msg_id, choice in message.get("selected_tags", {}).items()):
            break
    else:
        message = {
            "message": END_MESSAGE
        }
    
    if next_message_id == (len(messages)-1) and not message.get("choices"):
        session.ended = True
        next_message_id = None
    data["message_id"] = next_message_id
    session.save()

    Conversation.objects.create(session=session, message={
        "message":message.get("message", END_MESSAGE),
        "choices": message.get("choices")
    })
    message["bot"] = True
    return message

@csrf_exempt
def chat(request, pk, name):
    template = get_object_or_404(ChatbotTemplate, pk=pk, name=name, published=True)
    session_id = request.session.get(str(pk))
    session = None
    if session_id:
        session  = Session.objects.get(id=session_id)
        if session.ended:
            session = None
    if request.method == 'POST':
        if not session:
            return JsonResponse({"status":"Error", "message": "Session has ended",
                                 "code": "session_ended"})
        if not request.POST.get("answer"):
            return JsonResponse({"status":"Error", "message": "No answer found",
                                 "code": "no_answer"})
        return JsonResponse({"status": "Success", "message": get_next_message(session, template, int(request.POST.get("answer")))})
    if(session is None):
        session  = Session.objects.create(data={"answers":{}}, template=template)
        get_next_message(session, template)
    request.session[str(pk)] = session.id
    return render(request, 'webapp/chat.html',{
        "template": template,
        "messages": Conversation.objects.filter(session=session)
        })