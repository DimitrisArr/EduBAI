%------------------------------------------------------------------------------------------------------------------------------
grid(5,7).
cell(1..X, 1..Y) :- grid(X,Y).

timestamp(tmpt).

player(myp1;myp2;myp3).
empty_player(none).

fluent(position_player(PLAYER, X,Y)) :- cell(X, Y), player(PLAYER).

fluent(hasBall(PLAYER)) :- player(PLAYER).
fluent(hasBall(PLAYER)) :- empty_player(PLAYER).

%------------------------------------------------------------------------------------------------------------------------------
%oi kinhseis pou thelw na kannei kathe player
event(move(PLAYER, up))    :- player(PLAYER).  
event(move(PLAYER, down))  :- player(PLAYER).  
event(move(PLAYER, right)) :- player(PLAYER).  
event(move(PLAYER, left))  :- player(PLAYER).  

event(shoot(PLAYER)) :- player(PLAYER).  
event(doNothing(PLAYER)) :- player(PLAYER).  
event(pass(PLAYER, PLAYER2)) :- player(PLAYER), player(PLAYER2), PLAYER!=PLAYER2.  

%------------------------------------------------------------------------------------------------------------------------------
%periorismoi poy na eimai mesa sto grid
:- happens(move(PLAYER, up), T)   , holdsAt(position_player(PLAYER, X,Y),T), X<=1.
:- happens(move(PLAYER, down), T) , holdsAt(position_player(PLAYER, X,Y),T), X>=5.
:- happens(move(PLAYER, right), T), holdsAt(position_player(PLAYER, X,Y),T), Y>=7.
:- happens(move(PLAYER, left), T) , holdsAt(position_player(PLAYER, X,Y),T), Y<=1.

%mpoew na kanw pass h shoot mono an exw thn mpala
:- happens(shoot(PLAYER) ,T), not holdsAt(hasBall(PLAYER) ,T), player(PLAYER).
:- happens(pass(PLAYER) ,T),  not holdsAt(hasBall(PLAYER) ,T), player(PLAYER).

%an exw thn mpala den mporw na kanw doNothing
:- holdsAt(hasBall(PLAYER) ,T), happens(doNothing(PLAYER) ,T), player(PLAYER).

%den mporw na dwsw pasa ston eayto mou
:- happens(pass(PLAYER, PLAYER) ,T), player(PLAYER), holdsAt(hasBall(PLAYER) ,T).

%an exw thn mpala den ginete na mhn kanw tpt sto ksekinhma
:-  player(PLAYER),
    not happens(move(PLAYER, up), T-1),
    not happens(move(PLAYER, down), T-1),
    not happens(move(PLAYER, left), T-1),
    not happens(move(PLAYER, right), T-1),
    not happens(pass(PLAYER, _), T-1),
    not happens(doNothing(PLAYER), T-1),
    not happens(shoot(PLAYER), T-1), T-1>=0, time(T).

%den mporw thn idia xronikh stigmh na kanei kapoios kanw apo ena action
:- 2{
        happens(move(PLAYER, up), T-1);
        happens(move(PLAYER, down), T-1);
        happens(move(PLAYER, left), T-1);
        happens(move(PLAYER, right), T-1);
        happens(pass(PLAYER, _), T-1);
        happens(doNothing(PLAYER), T-1);
        happens(shoot(PLAYER), T-1)
    },
    player(PLAYER), T-1>=0, time(T).

%------------------------------------------------------------------------------------------------------------------------------
%......................................move-up
initiates(move(PLAYER,up), position_player(PLAYER, X-1,Y), T) 
:- holdsAt(position_player(PLAYER, X,Y),T),  player(PLAYER), time(T).

terminates(move(PLAYER,up), position_player(PLAYER, X,Y), T)  
:- holdsAt(position_player(PLAYER, X,Y),T), time(T).

%......................................move-down
initiates(move(PLAYER,down), position_player(PLAYER, X+1,Y), T) 
:- holdsAt(position_player(PLAYER, X,Y),T),  player(PLAYER), time(T).

terminates(move(PLAYER,down), position_player(PLAYER, X,Y), T)  
:- holdsAt(position_player(PLAYER, X,Y),T), time(T).

%......................................move-right
initiates(move(PLAYER,right), position_player(PLAYER, X,Y+1), T) 
:- holdsAt(position_player(PLAYER, X,Y),T),  player(PLAYER), time(T).

terminates(move(PLAYER,right), position_player(PLAYER, X,Y), T)  
:- holdsAt(position_player(PLAYER, X,Y),T), time(T).

%......................................move-left
initiates(move(PLAYER,left), position_player(PLAYER, X,Y-1), T) 
:- holdsAt(position_player(PLAYER, X,Y),T),  player(PLAYER), time(T).

terminates(move(PLAYER,left), position_player(PLAYER, X,Y), T)  
:- holdsAt(position_player(PLAYER, X,Y),T), time(T).

%......................................pass
initiates(pass(PLAYER1,PLAYER2), hasBall(PLAYER2), T)  
:- player(PLAYER1), player(PLAYER2), time(T).

terminates(pass(PLAYER1,PLAYER2), hasBall(PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), time(T).

%......................................shoot
initiates(shoot(PLAYER), hasBall(NONE), T) 
:- player(PLAYER), empty_player(NONE), time(T).

terminates(shoot(PLAYER), hasBall(PLAYER), T)  
:- player(PLAYER), time(T).

%------------------------------------------------------------------------------------------------------------------------------
holdsAt(position_player(myp1, p1x,p1y), 0).
holdsAt(position_player(myp2, p2x,p2y), 0).
holdsAt(position_player(myp3, p3x,p3y), 0).

holdsAt(hasBall(playerwball), 0).

%------------------------------------------------------------------------------------------------------------------------------


% go left if not in the left side
happens(move(PLAYER,left),0) :- holdsAt(position_player(PLAYER, PX,PY), 0), holdsAt(hasBall(PLAYER), 0), PY>1, not timestamp(10).

%if not in the left side and timestamp = 10, shoot
happens(shoot(PLAYER),0) :- holdsAt(position_player(PLAYER, PX,PY), 0), holdsAt(hasBall(PLAYER), 0), PY>1, timestamp(10).

%other players do nothing
happens(doNothing(PLAYER),0) :- not holdsAt(hasBall(PLAYER), 0), player(PLAYER).

%if in the left shoot
happens(shoot(PLAYER),0) :- holdsAt(position_player(PLAYER, PX,PY), 0), holdsAt(hasBall(PLAYER), 0), PY=1.

%------------------------------------------------------------------------------------------------------------------------------
#show holdsAt/2.
#show happens/2.

%------------------------------------------------------------------------------------------------------------------------------
