const core = require('@actions/core');
const fs = require('fs');

try {
  const pluginName = core.getInput('plugin-name');
  const entries = [];

  var files = fs.readdirSync('.');
  files.forEach(file => {
    const isDirectory = fs.lstatSync(file).isDirectory() && !file.includes('.git')

    if (isDirectory) {
      console.log(`processing version: ${file}`);
      const jsonFile = `${file}/${pluginName}/plugin.json`;
      const data = fs.readFileSync(jsonFile, 'utf8');
      const pluginJsonContents = JSON.parse(data);
      
      const uploadedItemsEntry = {
        Type: "Plugin",
        SupportedVersion: pluginJsonContents.SupportedVersions[0],
        DirectoryPath: `${file}/${pluginJsonContents.SystemName}/`,
        SystemName: pluginJsonContents.SystemName,
        SourceDirectoryPath: `${file}/Nop.Plugin.${pluginJsonContents.SystemName}/`
      }

      entries.push(uploadedItemsEntry);
    }
  });
  
  if (entries.length <= 0) {
    throw new Error("No uploadedItems entries returned.");
  }

  fs.writeFileSync('uploadedItems.json', JSON.stringify(entries, null, '\t'));
} catch (error) {
  core.setFailed(error.message);
}
