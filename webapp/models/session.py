from django.db.models import Model
from django.db.models.deletion import CASCADE
from django.db.models.fields import BooleanField, DateTimeField
from django.db.models.fields.json import JSONField
from django.db.models.fields.related import ForeignKey

from webapp.models.chatbot_template import ChatbotTemplate

class Session(Model):
    created = DateTimeField(auto_now_add=True)
    data = JSONField(blank=True, null=True)
    template = ForeignKey(ChatbotTemplate, on_delete=CASCADE)
    ended = BooleanField(default=False)