const { execSync } = require('child_process');

try {
    console.log('Initializing git...');
    execSync('git init');
    console.log('Adding files...');
    execSync('git add .');
    console.log('Commiting...');
    execSync('git commit -m "feat: complete IDE platform with responsiveness"');
    console.log('Setting branch...');
    execSync('git branch -M main');
    console.log('Setting remote...');
    // We use a regular string here to avoid shell expansion issues
    const url = "https://github.com/amanyatan/CLOUD-.git";
    try {
        execSync(`git remote add origin ${url}`);
    } catch (e) {
        execSync(`git remote set-url origin ${url}`);
    }
    console.log('Pushing...');
    execSync('git push -u origin main -f');
    console.log('Done!');
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
