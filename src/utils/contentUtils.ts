// Utility functions for content format detection and conversion

export const isHtmlContent = (content: string): boolean => {
  // Check for common HTML tags
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlTagPattern.test(content);
};

export const htmlToPlainText = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

export const plainTextToHtml = (text: string): string => {
  if (!text.trim()) return '<p></p>';
  
  return text
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();
      return trimmedLine ? `<p>${trimmedLine}</p>` : '<p><br></p>';
    })
    .join('');
};

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
}; 