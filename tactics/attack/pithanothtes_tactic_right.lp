%------------------------------------------------------------------------------------------------------------------------------
grid(5,7).
cell(1..X, 1..Y) :- grid(X,Y).

player(myp1;myp2;myp3;opp1;opp2;opp3).
empty_player(none).

fluent(position_player(PLAYER, X,Y)) :- cell(X, Y), player(PLAYER).

fluent(hasBall(PLAYER)) :- player(PLAYER).
fluent(hasBall(PLAYER)) :- empty_player(PLAYER).

timestamp(tmpt).


first_team(myp1).
first_team(myp2).
first_team(myp3).

second_team(opp1).
second_team(opp2).
second_team(opp3).

percent(100).
percent(-200).
pithanothta(1..X)  :- percent(X).
pithanothta(X..-1) :- percent(X).

fluent(pithanothta_shoot(X, PLAYER)) :- pithanothta(X), first_team(PLAYER).
fluent(pithanothta_pass(X, PLAYER))  :- pithanothta(X), first_team(PLAYER).


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
    not happens(shoot(PLAYER), T-1), T-1>=0, first_team(PLAYER), time(T).

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
    player(PLAYER), T-1>=0, first_team(PLAYER), time(T).

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







%---------------------------------------------------------------------------------------------------eimai sto dexio court
%......................................pithanothta shoot -- X>=3
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y))) , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
    % not holdsAt(pithanothta_shoot(_, PLAYER),1).

terminates(shoot(PLAYER), pithanothta_shoot(P, PLAYER), T)  
:- player(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T),  time(T),
    holdsAt(position_player(PLAYER, X,Y),T), 
    X>=3, (17*((X-3)+(7-Y))) != 0.

%......................................pithanothta shoot -- X>=3 -- DEF
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-75 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4, X==X5, X==X6,      Y==Y4, Y==Y5, Y==Y6,
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X>=3 -- DE
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-50 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4, X==X5,      Y==Y4, Y==Y5,  
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X>=3 -- EF
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-50 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X5, X==X6,      Y==Y5, Y==Y6,  
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X>=3 -- DF
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-50 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4, X1==X6,      Y==Y4, Y==Y6, 
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X>=3 -- D
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-25 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4,     Y==Y4, 
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X>=3 -- E
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-25 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T), 
    X==X5,      Y==Y5, 
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X>=3 -- F
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((X-3)+(7-Y)))-25 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X6,      Y==Y6, 
    X>=3,  time(T), (P-(17*((X-3)+(7-Y)))) != 0.



%.....................
%.....................
%.....................
%.....................



%......................................pithanothta shoot -- X<3
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y))) , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) !=0.

terminates(shoot(PLAYER), pithanothta_shoot(P, PLAYER), T)  
:- player(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T),  time(T),
    holdsAt(position_player(PLAYER, X,Y),T), 
    X<3, (17*((3-X)+(7-Y))) != 0.
%......................................pithanothta shoot -- X<3 -- DEF
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-75 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4, X==X5, X==X6,      Y==Y4, Y==Y5, Y==Y6,
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X<3 -- DE
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-50 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4, X==X5,      Y==Y4, Y==Y5,
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X<3 -- EF
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-50 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X5, X==X6,      Y==Y5, Y==Y6,
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X<3 -- DF
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-50 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4, X==X6,      Y==Y4, Y==Y6,
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X<3 -- D
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-25 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X4,     Y==Y4, 
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X<3 -- E
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-25 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X5,      Y==Y5, 
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.
%......................................pithanothta shoot -- X<3 -- F
initiates(shoot(PLAYER), pithanothta_shoot(P-(17*((3-X)+(7-Y)))-25 , PLAYER), T) 
:- player(PLAYER), first_team(PLAYER), holdsAt(pithanothta_shoot(P, PLAYER),T), holdsAt(position_player(PLAYER, X,Y),T), 
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X==X6,      Y==Y6,
    X<3,  time(T), (P-(17*((3-X)+(7-Y)))) != 0.



%.....................
%.....................
%.....................
%.....................



%.....................
%.....................
%.....................
%.....................



%......................................pithanothta pass -- X1<X2,Y1<Y2
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1))), PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.

terminates(pass(PLAYER1,PLAYER2), pithanothta_pass(P, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T), 
    holdsAt(pithanothta_pass(P, PLAYER1),T), 
    X1<X2, Y1<Y2,  time(T),
    (2*((X2-X1)+(Y2-Y1))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- DEF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-75, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5, X1==X6,      Y1==Y4, Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- DE
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5,      Y1==Y4, Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- DF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X6,      Y1==Y4, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- EF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5, X1==X6,      Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- D
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4,      Y1==Y4,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- E
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5,      Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1<Y2 -- F
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y2-Y1)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X6,      Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1<Y2,  time(T),
    (P-(2*((X2-X1)+(Y2-Y1)))) != 0.


%.....................
%.....................
%.....................
%.....................




%......................................pithanothta pass -- X1<X2,Y1>=Y2
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2))), PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.

terminates(pass(PLAYER1,PLAYER2), pithanothta_pass(P, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2), 
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(pithanothta_pass(P, PLAYER1),T), 
    X1<X2, Y1>=Y2,  time(T),
    (2*((X2-X1)+(Y1-Y2))) != 0.
%......................................pithanothta pass -- XX1<X2,Y1>=Y2 -- DEF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-75, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5, X1==X6,      Y1==Y4, Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1>=Y2 -- DE
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5,      Y1==Y4, Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1>=Y2 -- DF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X6,      Y1==Y4, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1>=Y2 -- EF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
   X1==X5, X1==X6,      Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1>=Y2 -- D
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4,      Y1==Y4,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1>=Y2 -- E
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5,      Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1<X2,Y1>=Y2 -- F
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X2-X1)+(Y1-Y2)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X6,      Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1<X2, Y1>=Y2,  time(T),
    (P-(2*((X2-X1)+(Y1-Y2)))) != 0.



%.....................
%.....................
%.....................
%.....................



%......................................pithanothta pass -- X1>=X2,Y1<Y2
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1))), PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.

terminates(pass(PLAYER1,PLAYER2), pithanothta_pass(P, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T), 
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2, time(T),
    (2*((X1-X2)+(Y2-Y1))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- DEF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-75, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5, X1==X6,      Y1==Y4, Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- DE
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5,      Y1==Y4, Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- DF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X6,      Y1==Y4, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- EF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5, X1==X6,      Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- D
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4,      Y1==Y4,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- E
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5,      Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1<Y2 -- F
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y2-Y1)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X6,      Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1<Y2,  time(T),
    (P-(2*((X1-X2)+(Y2-Y1)))) != 0.




%.....................
%.....................
%.....................
%.....................






%......................................pithanothta pass -- X1>=X2,Y1>=Y2 
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2))), PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.

terminates(pass(PLAYER1,PLAYER2), pithanothta_pass(P, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T), 
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2, Y1>=Y2, time(T),
    (2*((X1-X2)+(Y1-Y2))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- DEF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-75, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5, X1==X6,      Y1==Y4, Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- DE
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X5,      Y1==Y4, Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- DF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4, X1==X6,      Y1==Y4, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- EF
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-50, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5, X1==X6,      Y1==Y5, Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- D
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X4,      Y1==Y4,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- E
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X5,      Y1==Y5,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.
%......................................pithanothta pass -- X1>=X2,Y1>=Y2 -- F
initiates(pass(PLAYER1,PLAYER2), pithanothta_pass(P-(2*((X1-X2)+(Y1-Y2)))-25, PLAYER1), T)  
:- player(PLAYER1), player(PLAYER2), first_team(PLAYER1), first_team(PLAYER2),
    holdsAt(position_player(PLAYER1, X1,Y1),T), holdsAt(position_player(PLAYER2, X2,Y2),T),
    holdsAt(position_player(opp1, X4,Y4),T),holdsAt(position_player(opp2, X5,Y5),T),holdsAt(position_player(opp3, X6,Y6),T),
    X1==X6,      Y1==Y6,
    holdsAt(pithanothta_pass(P, PLAYER1),T),
    X1>=X2,Y1>=Y2,  time(T),
    (P-(2*((X1-X2)+(Y1-Y2)))) != 0.




%------------------------------------------------------------------------------------------------------------------------------
holdsAt(position_player(myp1, p1x,p1y), 0).
holdsAt(position_player(myp2, p2x,p2y), 0).
holdsAt(position_player(myp3, p3x,p3y), 0).



holdsAt(position_player(opp1, op1x,op1y), 0).
holdsAt(position_player(opp2, op2x,op2y), 0).
holdsAt(position_player(opp3, op3x,op3y), 0).

holdsAt(hasBall(playerwball), 0).

holdsAt(pithanothta_shoot(95, PLAYER), 0) :- first_team(PLAYER), holdsAt(hasBall(PLAYER), 0).
holdsAt(pithanothta_pass(99, PLAYER), 0)  :- first_team(PLAYER), holdsAt(hasBall(PLAYER), 0).

%------------------------------------------------------------------------------------------------------------------------------
1{
    happens(move(PLAYER, up), T) ;
    happens(move(PLAYER, down), T) ;
    happens(move(PLAYER, left), T) ;
    happens(move(PLAYER, right), T) ;
    happens(pass(PLAYER, PLAYER2), T) : player(PLAYER2) , first_team(PLAYER2), PLAYER!=PLAYER2, holdsAt(hasBall(PLAYER) ,T);
    happens(shoot(PLAYER), T) : holdsAt(hasBall(PLAYER) ,T);
    happens(doNothing(PLAYER), T)
}1 :- player(PLAYER), first_team(PLAYER), T=0, not timestamp(10). %time(T).  




:- holdsAt(pithanothta_pass(P,PLAYER),T), happens(pass(PLAYER,_),T-1), T-1>=0,  first_team(PLAYER), P<67, time(T), not timestamp(10).
:- holdsAt(pithanothta_shoot(P,PLAYER),T), happens(shoot(PLAYER),T-1), T-1>=0,  first_team(PLAYER), P<50, time(T), not timestamp(10).


%if timestamp = 10 shoot
happens(shoot(PLAYER),0) :- holdsAt(position_player(PLAYER, PX,PY), 0), holdsAt(hasBall(PLAYER), 0), timestamp(10).
happens(doNothing(PLAYER),0) :- not holdsAt(hasBall(PLAYER), 0), player(PLAYER),  timestamp(10).

% happens(shoot(aaa), 0).
% happens(move(bbb, left), 0).
% happens(move(ccc,up), 0).

%------------------------------------------------------------------------------------------------------------------------------
#show holdsAt/2.
#show happens/2.

%------------------------------------------------------------------------------------------------------------------------------
