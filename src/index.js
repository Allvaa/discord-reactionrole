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
            }
        });
        this.on("messageReactionAdd", (messageReaction, user) => { // eslint-disable-line
            const { message, message: { member } } = messageReaction;
            const reactionsArr = Object.values(this.config.reactions);
            if (!reactionsArr.map((data) => data.messageID).includes(message.id) || !reactionsArr.map((data) => data.emojiID).includes(messageReaction._emoji.id)) { // eslint-disable-line
                return undefined;
            }
            console.log("[INFO] Role Added.");
            return member.roles.add(this.config.reactions[message.id].roleToAddID);
        });
        this.on("messageReactionRemove", (messageReaction, user) => { // eslint-disable-line
            const { message, message: { member } } = messageReaction;
            const reactionsArr = Object.values(this.config.reactions);
            if (!reactionsArr.map((data) => data.messageID).includes(message.id) || !reactionsArr.map((data) => data.emojiID).includes(messageReaction._emoji.id)) { // eslint-disable-line
                return undefined;
            }
            console.log("[INFO] Role Removed.");
            return member.roles.remove(this.config.reactions[message.id].roleToAddID);
        });

        this.login(this.config.token);
    }
}

module.exports = new ReactionRoleClient();