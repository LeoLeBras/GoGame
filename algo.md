## Principes alogrithmiques du jeu de GO
1. 0n construit le plateau en canvas. `builder`
2. On met en place les rooms avec nodejs et le système à deux joueurs avec socket.io. `multiplayers`
3. Un joueur veut jouer :
	- on vérifie qu'il est pas dans une situation de suicide : `checkSuicide`
		- on vérifie si l'utilisateur va mourir si il pose son pion (analyse semblable au 5) 
		- si le pion va mourir, on vérifie si il a la capacité de tuer l'ennemi
	- on vérifie qu'il est pas dans une situation de KO :
		- on vérifie que le plateau de jeu obtenu par cette action n'est pas identique a celui obtenu à t - 1. `checkKO`
4. Si le joueur peut jouer dans l'endroit souhaité, on fait apparaitre le pion et on regarde si l'état de jeu à évoluer :
	- on vérifie si le pion joué à un pion ennemi positionné à côté de lui
	- si c'est le cas, on récupère la/les régions adverses par récusiité
	- on vérifie si ces régions sont pleines 
	- si une ou des régions pleine(s) sont trouvé(s), on retourne les contours de ces formes
	- on vérifie si le contour a aucune liberté (difficulté à prendre en compte du bord)
	- si l'utilisateur a fait des prisonniers, on les fait disparaitre.
5. Fin de partie :
	- si les 2 utilisateurs passent leur tour
	- si un des 2 utilisateurs a été déconnecté
	- si un utilisateur met plus de 5 minutes à jouer son coup
6. Comptage des points : 
	- ?