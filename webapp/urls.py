from django.urls import path
from django.urls.conf import include

from webapp.views.index import index
from . import views


urlpatterns = [
    path('', views.index, name="index"),
    path('chat/<int:pk>/<slug:name>/', views.chat, name='chat'),
    path('chattemplates/', include(([
        path('', views.ListChatbotTemplate.as_view(), name='list'),
        path('new/', views.CreateChatbotTemplate.as_view(), name='new'),
        path('<int:pk>/', include([
            path('',views.DetailChatbotTemplate.as_view(), name='detail'),
            path('update/',views.UpdateChatbotTemplate.as_view(), name='update'),
            path('delete/',views.DeleteChatbotTemplate.as_view(), name='delete'),
            path('publish/',views.publish_template, name='publish'),
        ])),
    ], "chatbottemplate"))),
]