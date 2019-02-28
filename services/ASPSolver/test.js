var x = '{"command": "clingo /edubai/tactics/tactic_defensive_1.lp /edubai/tactics/game_environment.lp /edubai/tactics/game_update.lp /edubai/tactics/dec.lp -c maxstep=1 -c tmpt=2 -c myp1=aaa -c myp2=bbb -c myp3=ccc -c opp1=ddd -c opp2=eee -c opp3=fff -c tm_B_p1_pos=(2,6) -c tm_B_p2_pos=(3,6) -c tm_B_p3_pos=(4,6) -c tm_A_p1_pos=(2,2) -c tm_A_p2_pos=(4,2) -c tm_A_p3_pos=(3,2) -c tm_B_side=right -c tm_A_side=left -c p_BH=fff"}';

console.log(1, x);

x = x.replace('{"command": "', '');
x = x.replace('"}', '');
x = updateChar(x,0,')');
x = updateChar(x,0,'(');




console.log(2, x);


/**
 * 
 * @param {string} data 
 */
function updateChar(data, index, char) {

    if (data.length == index + 1) {
        return data;
    }

    var pIndex = data.indexOf(char, index + 1);
    console.log('pIndex ', pIndex + "  " + data.length);
    if (pIndex < 0) {
        return data;
    }

    data = data.substring(0, pIndex) + '\\' + data.substring(pIndex);

    return updateChar(data, pIndex + 1,char);

}