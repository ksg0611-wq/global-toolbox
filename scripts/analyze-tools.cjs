const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../src/components/tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.jsx'));

const results = files.map(file => {
  const content = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  
  const hasHowToUse = /how to use|사용법/i.test(content);
  const hasFAQ = /faq|frequently asked questions/i.test(content);
  
  // Extract text roughly by removing tags and imports/functions
  // This is a rough estimation of static text.
  // We'll look for text inside elements like <p>, <h3>, <h2>, <li> that are plain text (no curly braces, or just simple text)
  const textBlocks = content.match(/>([^<{}]+)</g) || [];
  let textLength = 0;
  let wordCount = 0;
  
  textBlocks.forEach(block => {
    const text = block.replace(/[><]/g, '').trim();
    if (text.length > 15 && !text.includes('className=') && !text.includes('=>') && !text.includes('import ')) {
      textLength += text.length;
      wordCount += text.split(/\s+/).length;
    }
  });

  return {
    component: file,
    hasHowToUse,
    hasFAQ,
    textLength,
    wordCount
  };
});

console.log(JSON.stringify(results, null, 2));
