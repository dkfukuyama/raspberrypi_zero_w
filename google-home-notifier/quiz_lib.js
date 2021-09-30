function make_speech_text(param)
{
    let text = 
    param.whois
    + 'からのもんだいだよ。。'
    + param.main_phrase
    + '。。。。つぎのみっつのなかからえらんでね。。。';

    let ar = [param.wrong1, param.wrong2];
    
    if(Math.floor(Math.random() * 2)){
        ar = ar.reverse();
    }

    let e_num = Math.floor(Math.random() * 3) + 1;

    switch(e_num)
    {
    case 1:
        ar = [param.exact, ar[0], ar[1]];
        break;
    case 2:
        ar = [ar[0], param.exact, ar[1]];
        break;
    default :
        ar = [ar[0], ar[1], param.exact];
    }

    text += '。。。いち。。' + ar[0];
    text += '。。。に。。' + ar[1];
    text += '。。。さん。。' + ar[2];
    text += '。、。、。、。、。こたえは。' + e_num + 'だよ';

    return text;
}


exports.make_speech_text = make_speech_text;
