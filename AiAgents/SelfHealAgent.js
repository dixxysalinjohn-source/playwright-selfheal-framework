const fs = require('fs');
const { execSync } = require('child_process');

class SelfHealAgent {
  async runAndHeal(testFile) {
    let log = '';
    try {
      execSync(`npx playwright test ${testFile} --project=chromium 2>&1`, {encoding:'utf-8'});
      console.log('PASSED');
      return;
    } catch(e){ log = e.stdout || e.message; }

    const file = log.match(/Pages[\\/].*?\.js/)[0].replace(/\\/g,'/');
    const val = log.match(/getByPlaceholder\('([^']+)'\)|name:\s*'([^']+)'/)[1] || log.match(/name:\s*'([^']+)'/)[1];
    
    console.log(`Healing ${file} : ${val}`);
    let code = fs.readFileSync(file, 'utf8');
    code = code.replaceAll(`'${val}'`, `/${val.substring(0,4)}/i`);
    fs.writeFileSync(file, code);
    execSync(`npx playwright test ${testFile} --project=chromium --headed`, {stdio:'inherit'});
  }
}
new SelfHealAgent().runAndHeal(process.argv[2] || 'Tests/loginpagetest.spec.js');