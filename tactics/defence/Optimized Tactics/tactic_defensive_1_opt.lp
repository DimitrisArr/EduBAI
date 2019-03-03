% License: © 2018 Michail Giannoulis, 1078
% * ********************************************* * %
%        No1. DEFENSIVE TACTIC DESCRIPTION	        %
% - - - - - - - - - - - - - - - - - - - - - - - - - %
% P1 stays inactive under the basket cell, while P2 % 
% and P3 moves across to the cell of ball holder.   %
% * ********************************************* * % 
%                      HOW TO RUN	                %
% clingo -c maxstep=10 DEC.lp game_environment.lp game_update.lp tactic_defensive_1_opt.lp --opt-mode=optN -q1,1 --models 1
% - - - - - - - - - - - - - - - - - - - - - - - - - %

% * ********************************************* * %
%                      CONSTANTS	                %
% * ********************************************* * % 
#const mid_right_hit = (grid_x_max-2, grid_y_max).  % i.e. cell: (3,7)
#const mid_left_hit = (grid_x_max-2, grid_start).   % i.e. cell: (3,1)
% ------------------------------------------------- %

% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 						       RULES                		  %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% DEFEND BASKET & MARK ENEMY BALL HOLDER.
defend_basket(R, mid_right_hit) :- R = right, defender_team_side(_, R).       % PROTECT BASKET IF RIGHT SIDE
defend_basket(L, mid_left_hit) :- L = left, defender_team_side(_, L).         % PROTECT BASKET IF LEFT SIDE
mark_attacker(E, E_pos):- holdsAt(ball_holder(E), T), holdsAt(player_pos(E, E_pos), T), attacker_player(E). % MARK ATTACKER BALL HOLDER.

% ALL POSITIONS THAT THE DEFENDER TEAM MUST REACH.
hit(Pos, basket):- defend_basket(_, Pos).
hit(Pos, mark):- mark_attacker(_, Pos).

% ONLY ONE PLAYER (1/3) MUST GO UNDER THE BASKET. THE OTHER TWO PLAYERS (2/3) MUST GO TO MARK THE BALL HOLDER ENEMY PLAYER.
1{defender_duty(D, basket); defender_duty(D, mark)}1:- defender_player(D).
% WE MUST HAVE ONLY 1 PLAYER DEFEND THE BASKET.
:- not 1{defender_duty(D, basket)}1.
% WE MUST HAVE TWO PLAYERS TO MARK THE ENEMIES.
:- not 2{defender_duty(D, mark)}2.
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
:- happens(doNothing(D), T), defender_duty(D, Call), holdsAt(player_pos(D, Pos1), T), hit(Pos2, Call), Pos1 != Pos2.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 2) WHEN DEFENDER IS NOT AT A HIT CELL, THEN MOVE.
% DEFENDER MOVE UP: IS AT THE SAME Y-AXIS WITH THE HIT, BUT LOWER ON X-AXIS.
:- happens(move(D,up),T), defender_duty(D, Call), holdsAt(player_pos(D, (D_X, _)), T), hit((G_X, _), Call), D_X <= G_X.
% DEFENDER MOVE DOWN: IS AT THE SAME Y-AXIS WITH THE HIT, BUT HIGHER ON X-AXIS.
:- happens(move(D,down),T), defender_duty(D, Call), holdsAt(player_pos(D, (D_X, _)), T), hit((G_X, _), Call), D_X >= G_X.
% DEFENDER MOVE LEFT: IS AT THE SAME X-AXIS WITH THE HIT, BUT HIGHER ON Y-AXIS.
:- happens(move(D,left),T), defender_duty(D, Call), holdsAt(player_pos(D, (_, D_Y)), T), hit((_, G_Y), Call), D_Y <= G_Y.
% DEFENDER MOVE RIGHT: IS AT THE SAME X-AXIS WITH THE HIT, BUT LOWER ON Y-AXIS.
:- happens(move(D,right),T), defender_duty(D, Call), holdsAt(player_pos(D, (_, D_Y)), T), hit((_, G_Y), Call), D_Y >= G_Y.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% =========================================================== %
% =========================================================== %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 						   SCORE MODEL            		      %
%                      - - - - - - - - -                      %
% COMPUTE THE PATH DISTANCE OF A PLAYER FROM ITS START POINT  %
% UNTIL REACH A HIT POINT.                                    %
%                      - - - - - - - - -                      %
% Note: Compute once when reach the hit cell.                 %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
score(TM, Manhattan_Distance):- holdsAt(player_pos(TM, (HX,HY)), T), defender_duty(TM, Duty), hit((HX,HY), Duty),
								holdsAt(player_pos(TM, (SX, SY)), 0),
								Manhattan_Distance = (|SX - HX| + |SY - HY|).
score_model(TM, S+W):- score(TM, _), S = #sum{D, TM: score(TM, D)}, W = #count{D: score(TM, D)}.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %

% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 					      OPTIMIZATION            		      %
%                      - - - - - - - - -                      %
% MINIMIZE SCORE DISTANCES SIMULTANEOUSLY FOR ALL THE PLAYERS %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
overall_score(OS):- CM = #count{TM: happens(doNothing(TM), _)}, DEF = #count{TM: defender_duty(TM, _)}, CM == DEF, OS = #sum{SM, TM: score_model(TM, SM)}.
overall_score(OS):- CM = #count{TM: happens(doNothing(TM), _)}, DEF = #count{TM: defender_duty(TM, _)}, CM  < DEF, OS = 100000.
#minimize{OS: overall_score(OS)}.
% =========================================================== %
% =========================================================== %
% * ********************************************* * %
%                  DISPLAY RESULTS	 		        %
% * ********************************************* * %
#show holdsAt/2.
% #show happens/2.
% #show overall_score/1.
% #show defender_duty/2.
% #show defend_basket/2.
% #show mark_attacker/2.
% #show hit/2.
