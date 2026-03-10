const fs = require('fs');
const html = fs.readFileSync('gradely-admin.html', 'utf8');
const scripts = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
if (scripts) {
    scripts.forEach((s, idx) => {
        let code = s.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
            require('vm').createScript(code);
            console.log(`Script ${idx} OK`);
        } catch (e) {
            console.error(`Script ${idx} SyntaxError:`, e.message);

            // let's trace the actual line number relative to the file
            const lines = html.split('\n');
            let scriptStart = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('<script')) {
                    if (idx === 0) { scriptStart = i; break; }
                    idx--;
                }
            }
            console.error(`Approx line in HTML: ${scriptStart + e.line}`);
        }
    });
}
