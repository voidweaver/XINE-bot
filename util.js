module.exports = {
    escape: string => {
        return string.replace(/[\\_*~`>|@#]/g, '\\$&');
    },

    displayPrefix: prefix => {
        if (prefix == '') return 'none';
        return this.toInlineCode(prefix);
    },

    toInlineCode: string => {
        // Add zero-width space after each backtick
        if (string == '') return '` `';
        let result = string.replace(/^`/, '​$&').replace(/`/g, '$&​');
        return `\`\`${result}\`\``;
    },

    toCodeBlock: (string, lang) => {
        if (!lang) lang = '';
        let result = string.replace(/(`)(`)/g, '$1​$2'); // Add zero-width space between backticks
        return `\`\`\`${lang}\n${result}\`\`\``;
    },

    capitalize: string => {
        return string.charAt(0).toUpperCase() + string.substring(1);
    }
};
