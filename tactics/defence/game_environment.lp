% License: © 2018 Michail Giannoulis, 1078
% * ********************************************* * %
%                      CONSTANTS	                %
% * ********************************************* * % 
#const grid_x_max = 5.                              % upper value of x-axis.
#const grid_y_max = 7.                              % upper value of y-axis.
#const grid_start = 1.                              % lower value of x/y-axis.
% ------------------------------------------------- %
#const team_A_name = chicago_bulls.                 % Team A name.
#const team_A_p1 = opp1.                    % Player name.
#const team_A_p2 = opp2.                     % Player name.
#const team_A_p3 = opp3.                       % Player name.
#const team_B_name = lakers.                        % Team B name.
#const team_B_p1 = myp1.                    % Player name.
#const team_B_p2 = myp2.                    % Player name.
#const team_B_p3 = myp3.                   % Player name.

% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = %
% 						 Domain Definition                    %
% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = % 
% Instances.
team(team_A_name, team_A_p1).team(team_A_name, team_A_p2).team(team_A_name, team_A_p3). % Team A.
team(team_B_name, team_B_p1).team(team_B_name, team_B_p2).team(team_B_name, team_B_p3). % Team B.
player(team_A_p1). player(team_A_p2). player(team_A_p3).       % Players.
player(team_B_p1). player(team_B_p2). player(team_B_p3).       % Players cont.
pos(1..grid_x_max, 1..grid_y_max).							   % Valid Player Positions.
% Fluents.
fluent(player_pos(TM, (X,Y))):- player(TM), pos(X, Y).		   % Players Position.
fluent(ball_holder(TM)):- player(TM).						   % Ball Holder.
% Events.
event(shoot(TM)) :- player(TM).							   	   % Shoot the Ball.
event(pass(TM1, TM2)) :- player(TM1), player(TM2).			   % Pass the Ball.
event(doNothing(TM)) :- player(TM).							   % Do Nothing.
event(move(TM, up)):- player(TM).							   % Move up.
event(move(TM, down)):- player(TM).							   % Move down.
event(move(TM, right)):- player(TM).						   % Move Right.
event(move(TM, left)):- player(TM).							   % Move Left.

% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = %
% 					  Domain Axiomatization                   %
% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = % 
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% Shoot.
terminates(shoot(TM), ball_holder(TM), T) :- 
	player(TM), time(T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% Pass.
initiates(pass(TM1, TM2), ball_holder(TM2), T):- 
	player(TM1), player(TM2), time(T).
terminates(pass(TM1, TM2), ball_holder(TM1), T):- 
	player(TM1), player(TM2), time(T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% Move up.
initiates(move(TM, up), player_pos(TM, (X-1, Y)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
terminates(move(TM, up), player_pos(TM, (X, Y)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% Move down.
initiates(move(TM, down), player_pos(TM, (X+1, Y)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
terminates(move(TM, down), player_pos(TM, (X, Y)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% Move right.
initiates(move(TM, right), player_pos(TM, (X, Y+1)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
terminates(move(TM, right), player_pos(TM, (X, Y)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), player(TM), time(T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% Move left.
initiates(move(TM, left), player_pos(TM, (X, Y-1)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
terminates(move(TM, left), player_pos(TM, (X, Y)), T) :- 
	holdsAt(player_pos(TM, (X, Y)), T), time(T).
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = % 

% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = %
% 					    Event Constraints                     %
% = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = % 
% Move.
:- happens(move(TM, up),T), holdsAt(player_pos(TM, (X, Y)),T), X == grid_start, time(T), player(TM).    % you can not move up, if you are at the low edge of x-axis.
:- happens(move(TM, down),T), holdsAt(player_pos(TM, (X, Y)),T), X == grid_x_max, time(T), player(TM).  % you can not move down, if you are at the upper edge of x-axis.
:- happens(move(TM, right),T), holdsAt(player_pos(TM, (X, Y)),T), X == grid_y_max, time(T), player(TM). % you can not move right, if you are at the upper edge of y-axis.
:- happens(move(TM, left),T), holdsAt(player_pos(TM, (X, Y)),T), X == grid_start, time(T), player(TM).  % you can not move left, if you are at the low edge of y-axis.
% Shoot.
:- happens(shoot(TM),T), not holdsAt(ball_holder(TM),T), time(T), player(TM). 				            % you can only shoot, if you hold the ball.
% Pass.
:- happens(pass(TM1, TM2),T), TM1 == TM2, player(TM1), player(TM2), time(T). 				            % you can not pass to your self.
:- happens(pass(TM1, TM2),T), team(T1,TM1), team(T2,TM2), T1 != T2, player(TM1), player(TM2), time(T). 	% you can not pass to an opponent.
:- happens(pass(TM1, TM2),T), not holdsAt(ball_holder(TM1),T), time(T), player(TM1), player(TM2).       % you can only pass the ball, if you hold the ball.
% Do nothing.
:- happens(doNothing(TM),T), holdsAt(ball_holder(TM),T), time(T), player(TM). 					        % you only be inactive, if you do not hold the ball.
% Events.
:- not 0{happens(move(TM, _),T); happens(shoot(TM),T); happens(doNothing(TM),T); happens(pass(TM,_),T)}1, player(TM), time(T). % only 1 event per player every time.
% - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - %
