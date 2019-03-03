% License: © 2018 Michail Giannoulis, 1078
% * ********************************************* * %
%                      ARGUMENTS	                %
% - - - - - - - - - - - - - - - - - - - - - - - - - %
% -c tm_A_p1_pos = (3,4)                            %
% -c tm_A_p2_pos = (2,3)                            %
% -c tm_A_p3_pos = (5,3)                            %
% -c tm_B_p1_pos = (3,4)                            %
% -c tm_B_p2_pos = (2,6)                            %
% -c tm_B_p3_pos = (5,6)                            %
% -c p_BH = kris_dunn                               %
% -c tictac = 0                                     %
% -c tm_A_side = left                               %
% -c tm_B_side = right                              %
% * ********************************************* * % 

% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = %
% 					   GAME INITIAL STATE                     %
% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = % 
holdsAt(ball_holder(p_BH), 0).		                          % Ball holder.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
%                           TEAM A                            % TEAM A:
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
team_side(team_A_name, tm_A_side).                            % side of Team A.
holdsAt(player_pos(team_A_p1, tm_A_p1_pos), 0).               % position of player 1.
holdsAt(player_pos(team_A_p2, tm_A_p2_pos), 0).	              % position of player 2.
holdsAt(player_pos(team_A_p3, tm_A_p3_pos), 0).	              % position of player 3.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
%                           TEAM B                            % TEAM B:
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
team_side(team_B_name, tm_B_side).                            % side of Team B.
holdsAt(player_pos(team_B_p1, tm_B_p1_pos), 0).               % position of player 1.
holdsAt(player_pos(team_B_p2, tm_B_p2_pos), 0).	              % position of player 2.
holdsAt(player_pos(team_B_p3, tm_B_p3_pos), 0).	              % position of player 3.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %

attacker_team(TM):- team(TM, P), holdsAt(ball_holder(P), 0).      % FIND THE ATTACKER TEAM.
defender_team(TM):- team(TM,_), attacker_team(TM2), TM != TM2.    % FIND THE DEFENDER TEAM.
 
defender_team_side(TM, TM_side) :- defender_team(TM), team_side(TM, TM_side). % FIND THE DEFENDER TEAM SIDE.
attacker_team_side(TM, TM_side) :- attacker_team(TM), team_side(TM, TM_side). % FIND THE ATTACKER TEAM SIDE.

defender_player(P):- player(P), team(TM, P), defender_team(TM). % DEFENDER PLAYER.
attacker_player(P):- player(P), team(TM, P), attacker_team(TM). % ATTACKER PLAYER.
