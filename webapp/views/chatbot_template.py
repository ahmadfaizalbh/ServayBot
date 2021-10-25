from django.shortcuts import get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, DeleteView, UpdateView
from ..models import ChatbotTemplate
from django.urls import reverse, reverse_lazy

class ListChatbotTemplate(ListView):
    model = ChatbotTemplate


class CreateChatbotTemplate(CreateView):
    model = ChatbotTemplate
    fields = ["name", "messages"]

    def get_success_url(self):
        url = reverse("chatbottemplate:detail", kwargs={"pk":self.object.pk})
        return url


class DetailChatbotTemplate(DetailView):
    model = ChatbotTemplate
    fields = "__all__"


class UpdateChatbotTemplate(UpdateView):
    model = ChatbotTemplate
    fields = ["name", "messages"]

    def get_success_url(self):
        url = reverse("chatbottemplate:detail", kwargs={"pk":self.object.pk})
        return url

class DeleteChatbotTemplate(DeleteView):
    model = ChatbotTemplate
    success_url = reverse_lazy('chatbottemplate:list')

def publish_template(request, pk):
    template = get_object_or_404(ChatbotTemplate, pk=pk)
    template.published = True
    template.save(update_fields=['published'])
    return redirect(reverse('chatbottemplate:detail', kwargs={"pk":pk}))
