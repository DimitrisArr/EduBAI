% License: © 2018 Michail Giannoulis, 1078
% * ********************************************* * %
%                No2. DEFENSIVE TACTIC	            %
% - - - - - - - - - - - - - - - - - - - - - - - - - %
% P1, P2 and P3 move across to the cell of each     %
% enemy player.                                     %
% * ********************************************* * % 
%                      HOW TO RUN	                %
% clingo -c maxstep=0 DEC.lp game_environment.lp game_update.lp tactic_defensive_2.lp --models 1
% - - - - - - - - - - - - - - - - - - - - - - - - - %

% * ********************************************* * %
%                      CONSTANTS	                %
% * ********************************************* * % 
#const nodef = 3. % Number of Defenders
% ------------------------------------------------- %

% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 						       RULES                		  %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% A. MARK ATTACKER ENEMIES:
mark_attacker(E, E_pos):- holdsAt(player_pos(E, E_pos), T), attacker_player(E).
% B. EACH DEFENDER MUST MARK ONLY ONE ATTACKER:
{defender_duty(D, E)}:- mark_attacker(E, E_pos), defender_player(D).
:- not nodef{defender_duty(_,_)}nodef.
:- defender_duty(D1, E), defender_duty(D2, E), D1 != D2.
:- defender_duty(D, E1), defender_duty(D, E2), E1 != E2.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %

% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 						      EVENTS            		      %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% DEFENDER: ALL POSSIBLE EVENTS.
1{happens(doNothing(D), T); happens(move(D,up),T); happens(move(D,down),T); happens(move(D,right),T); happens(move(D,left),T)}1 :- defender_duty(D, _), holdsAt(player_pos(D, _), T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %

% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 				        EVENT CONSTRAINTS            	      %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 1) DEFENDER DO NOTHING: WHEN DEFENDER IS AT A HIT CELL.
:- happens(doNothing(D), T), defender_duty(D, E), holdsAt(player_pos(D, Pos1), T), holdsAt(player_pos(E, Pos2), T), Pos1 != Pos2.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 2) WHEN DEFENDER IS NOT AT A HIT CELL, THEN MOVE.
% DEFENDER MOVE UP: IS AT THE SAME Y-AXIS WITH THE HIT, BUT LOWER ON X-AXIS.
:- happens(move(D,up),T), defender_duty(D, E), holdsAt(player_pos(D, (D_X, _)), T), holdsAt(player_pos(E, (G_X, _)), T), D_X <= G_X.
% DEFENDER MOVE DOWN: IS AT THE SAME Y-AXIS WITH THE HIT, BUT HIGHER ON X-AXIS.
:- happens(move(D,down),T), defender_duty(D, E), holdsAt(player_pos(D, (D_X, _)), T), holdsAt(player_pos(E, (G_X, _)), T), D_X >= G_X.
% DEFENDER MOVE LEFT: IS AT THE SAME X-AXIS WITH THE HIT, BUT HIGHER ON Y-AXIS.
:- happens(move(D,left),T), defender_duty(D, E), holdsAt(player_pos(D, (_, D_Y)), T), holdsAt(player_pos(E, (_, G_Y)), T), D_Y <= G_Y.
% DEFENDER MOVE RIGHT: IS AT THE SAME X-AXIS WITH THE HIT, BUT LOWER ON Y-AXIS.
:- happens(move(D,right),T), defender_duty(D, E), holdsAt(player_pos(D, (_, D_Y)), T), holdsAt(player_pos(E, (_, G_Y)), T), D_Y >= G_Y.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %

% * ********************************************* * %
%                  DISPLAY RESULTS	 		        %
% * ********************************************* * %
%#show happens/2.
#show holdsAt/2.
% #show defender_duty/2.
% #show defend_basket/2.
% #show mark_attacker/2.
% #show hit/2.
% #show flagged/2.
