from django.urls import path
from .views import maze_game

urlpatterns = [
    path('', maze_game, name='maze_game'), 
    path('maze/', maze_game, name='maze_game'),
]
