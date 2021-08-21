const core = require('@actions/core');
const fs = require('fs');

try {
  const pluginName = core.getInput('plugin-name');
  const entries = [];

  var files = fs.readdirSync('.');
  files.forEach(file => {
    const isDirectory = fs.lstatSync(file).isDirectory() && !file.includes('.git')

    if (isDirectory) {
      const data = fs.readFileSync(`${file}/${pluginName}/plugin.json`, 'utf8');

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

  fs.writeFileSync('uploadedItems.json', JSON.stringify(entries, null, '\t'));
} catch (error) {
  core.setFailed(error.message);
}