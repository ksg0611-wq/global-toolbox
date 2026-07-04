import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const AD_KEYWORDS = ['doubleclick.net', 'googlesyndication.com', 'googleads.g'];

function removeAdContent(html) {
  let content = html;
  for (const keyword of AD_KEYWORDS) {
    while (content.includes(keyword)) {
      const kwPos = content.includes(keyword) ? content.indexOf(keyword) : -1;
      if (kwPos === -1) break;
      const tagStart = content.lastIndexOf('<', kwPos);
      if (tagStart === -1) break;
      const tagNameMatch = content.substring(tagStart).match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
      if (!tagNameMatch) break;
      const tagName = tagNameMatch[1].toLowerCase();
      const closeTag = `</${tagName}>`;
      const tagEnd = content.indexOf(closeTag, tagStart);
      if (tagEnd === -1) {
        const openEnd = content.indexOf('>', tagStart);
        if (openEnd === -1) break;
        content = content.substring(0, tagStart) + content.substring(openEnd + 1);
      } else {
        content = content.substring(0, tagStart) + content.substring(tagEnd + closeTag.length);
      }
    }
  }
  return content;
}

function getAllHtmlFiles(dir) {
  const files = [];
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = getAllHtmlFiles('dist');
let cleaned = 0;

for (const file of htmlFiles) {
  const original = readFileSync(file, 'utf8');
  const cleaned_content = removeAdContent(original);
  if (cleaned_content !== original) {
    writeFileSync(file, cleaned_content);
    cleaned++;
    console.log(`Cleaned: ${file}`);
  }
}

console.log(`Total cleaned: ${cleaned} files`);
