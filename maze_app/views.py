from django.shortcuts import render
def maze_game(request):
    return render(request, "maze_app/maze_game.html")
# Create your views here.
