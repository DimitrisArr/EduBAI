% License: © 2018 Michail Giannoulis, 1078
% * ********************************************* * %
%                No3. DEFENSIVE TACTIC	            %
% - - - - - - - - - - - - - - - - - - - - - - - - - %
% P1, P2 and P3 stay inactive under the cell of     %
% two point shot                                    %
% * ********************************************* * % 
%                      HOW TO RUN	                %
% clingo -c maxstep=10 DEC.lp game_environment.lp game_update.lp tactic_defensive_3_opt.lp --opt-mode=optN -q1,1 --models 1
% - - - - - - - - - - - - - - - - - - - - - - - - - %

% * ********************************************* * %
%                      CONSTANTS	                %
% * ********************************************* * % 
#const mid_right_hit = (grid_x_max-2, grid_y_max).          % i.e. cell: (3,7)
#const mid_right_hit_front = (grid_x_max-2, grid_y_max-1).  % i.e. cell: (3,6)
#const mid_right_hit_down = (grid_x_max-1, grid_y_max).     % i.e. cell: (4,7)
#const mid_left_hit = (grid_x_max-2, grid_start).           % i.e. cell: (3,1)
#const mid_left_hit_front = (grid_x_max-1, grid_start).     % i.e. cell: (4,1)
#const mid_left_hit_down = (grid_x_max-2, grid_start+1).    % i.e. cell: (3,2)
% ------------------------------------------------- %
#const udc = 3.                                     % Under Defend Cells. 
#const nodef = 3.                                   % Number of Defenders. 
% ------------------------------------------------- %

% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 						       RULES                		  %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% A. CELLS THAT MUST BE DEFENDED.
{defend_area(R, mid_right_hit); defend_area(R, mid_right_hit_front); defend_area(R, mid_right_hit_down)}:- R = right, defender_team_side(_, R).
{defend_area(L, mid_left_hit); defend_area(L, mid_left_hit_front); defend_area(L, mid_left_hit_down)}:- L = left, defender_team_side(_, L).
:- not udc{defend_area(_,_)}udc.
% B. EACH DEFENDER MUST DEFEND ONLY ONE CELL:
{defender_duty(D, C_pos)}:- defend_area(R, C_pos), defender_player(D).
:- not nodef{defender_duty(_,_)}nodef.
:- defender_duty(D1, C_pos), defender_duty(D2, C_pos), D1 != D2.
:- defender_duty(D, C_pos1), defender_duty(D, C_pos2), C_pos1 != C_pos2.

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
:- happens(doNothing(D), T), defender_duty(D, Pos2), holdsAt(player_pos(D, Pos1), T), Pos1 != Pos2.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 2) WHEN DEFENDER IS NOT AT A HIT CELL, THEN MOVE.
% DEFENDER MOVE UP: IS AT THE SAME Y-AXIS WITH THE HIT, BUT LOWER ON X-AXIS.
:- happens(move(D,up),T), defender_duty(D, (G_X, _)), holdsAt(player_pos(D, (D_X, _)), T), D_X <= G_X.
% DEFENDER MOVE DOWN: IS AT THE SAME Y-AXIS WITH THE HIT, BUT HIGHER ON X-AXIS.
:- happens(move(D,down),T), defender_duty(D, (G_X, _)), holdsAt(player_pos(D, (D_X, _)), T),  D_X >= G_X.
% DEFENDER MOVE LEFT: IS AT THE SAME X-AXIS WITH THE HIT, BUT HIGHER ON Y-AXIS.
:- happens(move(D,left),T), defender_duty(D, (_, G_Y)), holdsAt(player_pos(D, (_, D_Y)), T), D_Y <= G_Y.
% DEFENDER MOVE RIGHT: IS AT THE SAME X-AXIS WITH THE HIT, BUT LOWER ON Y-AXIS.
:- happens(move(D,right),T), defender_duty(D, (_, G_Y)), holdsAt(player_pos(D, (_, D_Y)), T), D_Y >= G_Y.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% =========================================================== %
% =========================================================== %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% 						   SCORE MODEL            		      %
%                      - - - - - - - - -                      %
% COMPUTE THE PATH DISTANCE OF A PLAYER FROM ITS START POINT  %
% UNTIL REACH A HIT POINT.                                    %
%                      - - - - - - - - -                      %
% Note: Compute once when reach the attacker to mark cell.    %
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
score(TM, Manhattan_Distance):- holdsAt(player_pos(TM, (HX,HY)), T), defender_duty(TM, (HX,HY)),
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
% #show defend_area/2.
% #show defender_duty/2.
% #show defend_basket/2.
% #show mark_attacker/2.
% #show hit/2.
% #show flagged/2.
