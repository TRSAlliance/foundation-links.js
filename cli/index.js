# Foundation Links
A JavaScript project for [describe purpose].

## Setup
1. Clone the repo: `git clone https://github.com/TRSAlliance/foundation-links.js`
2. Install dependencies: `npm install`
3. Set NETLIFY_AUTH_TOKEN in your environment.
4. Run build: `npm run build`
5. Deploy: `npm run deploy`

## CLI
Run `node cli/index.js` for CLI usage.
  
const { logCreedy, isTraining, trainingLevel, TrainingError } = require('./utils');

const commands = {};

commands['seo'] = {
  agent: 'deepseek',
  run: async (target) => {
    await logCreedy('deepseek', `Validating SEO for ${target}...`);
    try {
      const config = require('../src/.vuepress/config.js');
      if (!config.head || !config.head.some(tag => tag[0] === 'meta' && tag[1].name === 'keywords')) {
        if (isTraining()) {
          await logCreedy('deepseek', `🚨 [Training Lv.${trainingLevel()}] Missing SEO keywords`, 'warning');
          return;
        }
        throw new TrainingError('SEO-01', 'Missing SEO keywords in VuePress config', 'Add meta keywords to src/.vuepress/config.js');
      }
      await logCreedy('deepseek', '✅ SEO meta tags validated');
    } catch (error) {
      console.warn(error.message);
    }
  }
};

module.exports = { commands };
