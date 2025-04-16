// views/reportTemplate.js

module.exports = (reportData) => {
    return `
      Report Title: ${reportData.title}
      Date: ${new Date().toLocaleDateString()}
      
      Content:
      ${reportData.content}
    `;
  };
  