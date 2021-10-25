
from django.db.models.base import Model
from django.db.models.deletion import CASCADE
from django.db.models.fields import BooleanField, DateTimeField
from django.db.models.fields.json import JSONField
from django.db.models.fields.related import ForeignKey

from webapp.models.session import Session


class Conversation(Model):
    session = ForeignKey(Session, on_delete=CASCADE)
    message = JSONField()
    created = DateTimeField(auto_now_add=True)
    bot = BooleanField(default=True)