const fs = require('fs');
const path = require('path');

function listFilesInFolder(folderPath, country) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    const fileList = files.map((file) => {
      return { name: file };
    });

    const jsonResult = JSON.stringify(fileList, null, 2);

    console.log('Files in folder (as JSON):');
    console.log(jsonResult);

    // Optionally, you can save the JSON to a file
    if(country === 'portugal') {
        fs.writeFileSync('fileList_PT.json', jsonResult, 'utf-8');
    }

    if(country === 'brazil') {
        fs.writeFileSync('fileList_BR.json', jsonResult, 'utf-8');

    }
  });
}

// Replace 'path/to/your/folder' with the actual path to your folder
const folderPathPT = path.join(__dirname, './portugal');
listFilesInFolder(folderPathPT, 'portugal');
const folderPathBR = path.join(__dirname, './brazil/Estados');
listFilesInFolder(folderPathBR, 'brazil');