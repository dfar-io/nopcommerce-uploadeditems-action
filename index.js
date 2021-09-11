const core = require('@actions/core');
const fs = require('fs');

try {
  const pluginName = core.getInput('plugin-name');
  const entries = [];

  var files = fs.readdirSync('.');
  files.forEach(file => {
    const isDirectory = fs.lstatSync(file).isDirectory() && !file.includes('.git')

    if (isDirectory) {
      console.log(`processing dir: ${file}`);
      const jsonFile = `${file}/${pluginName}/plugin.json`;
      if(!fs.existsSync(jsonFile)) {
        console.log(`error thrown - file not found`);
        throw new Error("plugin.json not found at ${jsonFile}");
      }
      const data = fs.readFileSync(jsonFile, 'utf8');
      console.log(`data: ${data}`);
      const pluginJsonContents = JSON.parse(data);
      if (pluginJsonContents.length <= 0) {
        console.log(`error thrown - no content`);
        throw new Error("plugin.json has no content");
      }
      console.log(pluginJsonContents);
      
      const uploadedItemsEntry = {
        Type: "Plugin",
        SupportedVersion: pluginJsonContents.SupportedVersions[0],
        DirectoryPath: `${file}/${pluginJsonContents.SystemName}/`,
        SystemName: pluginJsonContents.SystemName,
        SourceDirectoryPath: `${file}/Nop.Plugin.${pluginJsonContents.SystemName}/`
      }
      
      console.log(uploadedItemsEntry);

      entries.push(uploadedItemsEntry);
      
      console.log(entries);
    }
  });
  
  if (entries.length <= 0) {
    throw new Error("No uploadedItems entries returned.");
  }

  fs.writeFileSync('uploadedItems.json', JSON.stringify(entries, null, '\t'));
} catch (error) {
  core.setFailed(error.message);
}
