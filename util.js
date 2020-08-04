const { prefix } = require('./settings.json');

module.exports = {
    escape: (string) => {
        return string.replace(/[\\_*~`>|@#]/g, '\\$&');
    },

    displayPrefix: (prefix) => {
        if (prefix == '') return 'none';
        return this.toInlineCode(prefix);
    },

    toInlineCode: (string) => {
        if (typeof string !== 'string') string = string.toString();
        // Add zero-width space after each backtick
        if (string == '') return '` `';
        let result = string.replace(/^`/, '​$&').replace(/`/g, '$&​');
        return `\`\`${result}\`\``;
    },

    toCodeBlock: (string, lang) => {
        if (typeof string !== 'string') string = string.toString();
        if (!lang) lang = '';
        let result = string.replace(/(`)(`)/g, '$1​$2'); // Add zero-width space between backticks
        return `\`\`\`${lang}\n${result}\`\`\``;
    },

    capitalize: (string) => {
        return string.charAt(0).toUpperCase() + string.substring(1);
    },

    getPrefix: (client, guild) => {
        return client.settings.get(guild.id, 'prefix', prefix);
    },

    humanTime: (seconds, show_minutes = true) => {
        let result = '';

        let hrs = Math.floor(seconds / 3600).toString();

        let mins = (Math.floor(seconds / 60) % 60).toString();
        if (seconds >= 3600) mins = mins.padStart(2, '0');

        let secs = (seconds % 60).toString().padStart(2, '0');

        if (seconds >= 3600) result += `${hrs}:`;
        if (seconds >= 60 || show_minutes) result += `${mins}:`;
        result += secs;

        return result;
    },

    visualPadFront: (str, desired_width) => {
        remaining = desired_width - str.length;
        if (remaining <= 0) return str;
        return '‎ '.repeat(remaining) + str;
    },

    visualPadBack: (str, desired_width) => {
        remaining = desired_width - str.length;
        if (remaining <= 0) return str;
        return str + '‎ '.repeat(remaining);
    },
};
