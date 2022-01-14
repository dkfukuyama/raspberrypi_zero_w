const fs = require('fs'); 
const filesMaxLength = 10;

function trimEnd(str, s){
    if(str[str.length] == s) str = str.substring(0,str.length-1);
    return str;
}
const namePair = {
    'りか' : 'rika',
    'れいな' : 'reina',
    'まさのり' : 'masa',
}

function getExistingFileNames(whois, searchPath){
    const allDirents = fs.readdirSync(searchPath,  { withFileTypes: true });
    let existingFileNames = '';
    if(whois == 'all')
    {
        existingFileNames = allDirents.filter(dirent => dirent.isFile()).map(({ name }) => name)
        .filter((file)=>new RegExp('(rika|reina|masa)' + ".*\.json$").test(file));
    }else{
        existingFileNames = allDirents.filter(dirent => dirent.isFile()).map(({ name }) => name)
        .filter((file)=>new RegExp(namePair[whois] + ".*\.json$").test(file));
    }
    return existingFileNames;
}

function createWriteFilePath(whois, searchPath){
    let returnFileName ='';
    const existingFileNames = getExistingFileNames(whois, searchPath);
    if(existingFileNames.length < filesMaxLength){
        do{
            let indexStr = Math.floor(Math.random() * filesMaxLength).toString().padStart(2, '0');
            returnFileName = indexStr + '_' + namePair[whois] + '.json';
        }while(existingFileNames.includes(returnFileName));
    }
    return returnFileName;
}

function registerNewFile(body, quiz_path) {
    delete body.type;
    delete body.mode;
    body.date = new Date();
    let out_text = JSON.stringify(body, null, "\t");
    let writeFileName = createWriteFilePath(body.whois, quiz_path);
    console.log(writeFileName);
    let writeFilePath = quiz_path + "/" + writeFileName;
    fs.writeFileSync(writeFilePath, out_text);
}

function getExistingFileNamesToJsonString(whois, searchPath){
    const existingFileNames = getExistingFileNames(whois, searchPath);

    const result = [];

    existingFileNames.forEach((obj) => {
        let r = JSON.parse(fs.readFileSync(searchPath + "/" + obj, 'utf8'));
        r.filename = obj;
        result.push(r); 
    });

    result.sort((a,b)=>(Date.parse(a.date)-Date.parse(b.date)));
    return result;
}

function deleteFile(filename, quiz_path)
{
    fs.unlinkSync(quiz_path + "/" + filename);
}

function randomDebug(quiz_path)
{
    let result = getExistingFileNames('all', quiz_path);
    let obj = result[Math.floor(Math.random() * result.length)];
    let r = JSON.parse(fs.readFileSync(quiz_path + "/" + obj, 'utf8'));
    console.log(r);
    let ret = make_speech_text(r);
    console.log(ret);
    return ret;
}

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
    text += '。、。、。、。、。こたえわ～～～～～～～～～～こたえわ～～～～～～～～～～。' + e_num + '、、'+ param.exact　+ 'だよ';

    return text;
}

exports.registerNewFile = registerNewFile;
exports.getExistingFileNames = getExistingFileNames;
exports.createWriteFilePath = createWriteFilePath;
exports.getExistingFileNamesToJsonString = getExistingFileNamesToJsonString
exports.deleteFile = deleteFile;

exports.randomDebug = randomDebug;

exports.make_speech_text = make_speech_text;
