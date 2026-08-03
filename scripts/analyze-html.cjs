const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../dist/tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const results = dirs.map((slug, index) => {
  const htmlPath = path.join(toolsDir, slug, 'index.html');
  if (!fs.existsSync(htmlPath)) return null;
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract main content by removing header and footer
  // Simple regex to remove <header>...</header> and <footer>...</footer>
  html = html.replace(/<header[\s\S]*?<\/header>/gi, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  
  // Extract text only (strip all tags)
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  const hasHowToUse = /how to use|사용법/i.test(textContent);
  const hasFAQ = /faq|frequently asked questions/i.test(textContent);
  
  const wordCount = textContent.split(' ').filter(w => w.length > 0).length;
  
  // Title approximation (just formatting slug)
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    no: index + 1,
    title,
    hasHowToUse,
    hasFAQ,
    wordCount
  };
}).filter(Boolean);

console.log(JSON.stringify(results, null, 2));
