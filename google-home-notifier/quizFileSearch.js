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
    const existingFileNames = allDirents.filter(dirent => dirent.isFile()).map(({ name }) => name)
        .filter((file)=>new RegExp(namePair[whois] + ".*\.json$").test(file));
    return existingFileNames;
    }

function createWriteFilePath(whois, searchPath){
    //console.log('createWriteFilePath');
    let returnFileName ='';
    const existingFileNames = getExistingFileNames(whois, searchPath);
    if(existingFileNames.length < filesMaxLength){
        while(!existingFileNames.includes(returnFileName)){
            let indexStr = Math.floor(Math.random() * 10).toString().padStart(2, '0');
            returnFileName = indexStr + '_' + namePair[whois] + '.json';
            //console.log(returnFileName);
        }
    }
    return returnFileName;
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


exports.getExistingFileNames = getExistingFileNames;
exports.createWriteFilePath = createWriteFilePath;
exports.getExistingFileNamesToJsonString = getExistingFileNamesToJsonString
