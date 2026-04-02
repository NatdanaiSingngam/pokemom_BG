const fs = require('fs');

const path = 'page.js';
let content = fs.readFileSync(path, 'utf8');

// Line 665: Remove ESCAPED from !['SUCCESS', 'ESCAPED'].includes...
content = content.replace(
  `{encounterData && !['SUCCESS', 'ESCAPED'].includes(catchResult?.status) ? (`,
  `{encounterData && catchResult?.status !== 'SUCCESS' ? (`
);

// Line 678: Change the Run Away button to Give Up button
content = content.replace(
  `🏃‍♂️ หนีดีกว่า (หนี)`,
  `🏃‍♂️ ยอมแพ้และจบเทิร์น`
);

// Line 684: Remove ESCAPED from conditional classes
content = content.replace(
  "catchResult.status === 'ESCAPED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : ",
  ""
);

// Line 687: Remove the ESCAPED <p> tag
content = content.replace(
  /\{catchResult\.status === 'ESCAPED' && <p.*<\/p>\}/s,
  ''
);

// Line 691: Update the hide condition for End Turn button. It was `!encounterData || ['SUCCESS', 'ESCAPED']...`
content = content.replace(
  `{(!encounterData || ['SUCCESS', 'ESCAPED'].includes(catchResult?.status)) && (`,
  `{(!encounterData || catchResult?.status === 'SUCCESS') && (`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Removed ESCAPE functionality.');
