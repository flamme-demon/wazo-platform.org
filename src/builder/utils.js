const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');

let cachedOverviews = null;
let cachedSections = null;
let cachedModules = null;
let cachedPlugins = null;

const walk = (basePath, regexp, encoding = 'utf8', custom = false) => {
  const files = fs.readdirSync(basePath);
  const dirname = basePath.split('/').pop();
  let results = { [dirname]: {} };

  files.forEach(file => {
    const filePath = basePath + '/' + file;
    const stat = fs.lstatSync(filePath);

    // Do not follow symlinks to avoid max recursion on OSX with filename in different case
    // eg: Ringlist.xml symlink to RINGLIST.XML
    if (stat.isSymbolicLink()) {
      return;
    }

    if (stat.isDirectory()) {
      results = { ...results, ...walk(filePath, regexp, encoding, custom) };
    } else if (file.match(regexp)) {
      // HEADS UP: hard code
      const wazo_plugin = `${basePath.split('/')[4]}-${basePath.split('/')[5]}`;
      const content = fs.readFileSync(filePath, encoding);
      results[dirname][file] = custom ? {
          file: content,
          wazo_plugin,
        } : content;
    }
  });

  return results;
};

const getProvisioningPlugins = () => {
  if (cachedPlugins) {
    return cachedPlugins;
  }

  // Clone the repo
  const repoPath = '/tmp/wazo-provd-plugins';
  execSync(`
    rm -rf ${repoPath};
    git clone https://github.com/wazo-platform/wazo-provd-plugins.git ${repoPath};
  `);

  const pluginInfoFiles = walk(repoPath, /plugin-info/, null, true);
  cachedPlugins = {};

  // Parse plugin-info files
  Object.keys(pluginInfoFiles).forEach(basePath => {
    Object.keys(pluginInfoFiles[basePath]).forEach(fileName => {
      try {
        const content = JSON.parse(pluginInfoFiles[basePath][fileName].file);
        const { wazo_plugin } = pluginInfoFiles[basePath][fileName];
        Object.keys(content.capabilities).forEach(capabilityName => {
          const [vendor, phone, firmware] = capabilityName.split(', ');
          if (!(vendor in cachedPlugins)) {
            cachedPlugins[vendor] = {};
          }
          if (!(phone in cachedPlugins[vendor])) {
            cachedPlugins[vendor][phone] = {};
          }

          cachedPlugins[vendor][phone][firmware] = content.capabilities[capabilityName];
          cachedPlugins[vendor][phone][firmware].wazo_plugin = `${wazo_plugin} (v${content.version})`;
        });
      } catch (error) {
        console.log('json error in ', basePath, fileName, error);
      }
    });
  });

  delete cachedPlugins['*'];

  return cachedPlugins;
};

module.exports = {
  getProvisioningPlugins,
  walk,
};