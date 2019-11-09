const { Client } = require("discord.js");

class ReactionRoleClient extends Client {
    constructor(...args) {
        super(...args);
        this.config = require("./config.json"); // eslint-disable-line

        this.on("ready", () => {
            console.log(`[INFO] Logged in as ${this.user.tag}.`);
            // eslint-disable-next-line no-restricted-syntax
            for (const data of Object.values(this.config.reactions)) {
                this.channels.get(data.channelID).messages.fetch(data.messageID);
                console.log(`[INFO] ${data.messageID} fetched.`);
            }
        });
        this.on("messageReactionAdd", (messageReaction, user) => {
            const { message } = messageReaction;
            const data = this.config.reactions[message.id];
            if (messageReaction.me) {
                return undefined;
            }
            if (!data || !data.emojis[messageReaction._emoji.id || messageReaction._emoji.name]) { // eslint-disable-line
                return undefined;
            }
            const member = message.guild.member(user);
            console.log("[INFO] Role Added.");
            return member.roles.add(data.emojis[messageReaction._emoji.id || messageReaction._emoji.name]); // eslint-disable-line
        });
        this.on("messageReactionRemove", (messageReaction, user) => {
            const { message } = messageReaction;
            const data = this.config.reactions[message.id];
            if (messageReaction.me) {
                return undefined;
            }
            if (!data || !data.emojis[messageReaction._emoji.id || messageReaction._emoji.name]) { // eslint-disable-line
                return undefined;
            }
            const member = message.guild.member(user);
            console.log("[INFO] Role Removed.");
            return member.roles.remove(data.emojis[messageReaction._emoji.id || messageReaction._emoji.name]); // eslint-disable-line
        });

        this.login(this.config.token);
    }
}

module.exports = new ReactionRoleClient();