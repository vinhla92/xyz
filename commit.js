const fs = require('fs');
const pac = require('./package.json');
const rev = fs.readFileSync('.git/HEAD').toString();
const commit = fs.readFileSync('./.git/' + rev.substring(5).replace(/(\r\n|\n|\r)/gm,"")).toString();

pac.hash = commit.replace(/(\r\n|\n|\r)/gm,"");

fs.writeFile("./package.json", JSON.stringify(pac, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("Commit has been updated");
});