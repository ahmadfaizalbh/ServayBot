from django.db.models import Model
from django.db.models.fields import BooleanField, CharField
from django.db.models.fields.json import JSONField


class ChatbotTemplate(Model):
    name = CharField(max_length=30, unique=True)
    messages = JSONField(blank=True, null=True)
    published = BooleanField(default=False)
