const { Client } = require("discord.js");

class ReactionRoleClient extends Client {
    constructor(...args) {
        super(...args);
        this.config = require("./config.json"); // eslint-disable-line

        this.on("ready", () => {
            console.log(`[INFO] Logged in as ${this.user.tag}.`);
            // eslint-disable-next-line no-restricted-syntax
            for (const data of Object.values(this.config.reactions)) {
                try {
                    this.channels.get(data.channelID).messages.fetch(data.messageID);
                    console.log(`[INFO] ${data.messageID} fetched.`);
                } catch (e) {
                    console.log(`[ERR] Error when fetching ${data.messageID}, because ${e.message}.`);
                }
            }
        });
        this.on("messageReactionAdd", (messageReaction, user) => {
            this.handleRole(messageReaction, user, "add");
        });
        this.on("messageReactionRemove", (messageReaction, user) => {
            this.handleRole(messageReaction, user, "remove");
        });

        this.login(this.config.token);
    }

    handleRole(messageReaction, user, type) {
        if (!type || !["add", "remove"].includes(type.toLowerCase())) return undefined;
        const { message } = messageReaction;
        const data = this.config.reactions[message.id];
        const emoji = data.emojis[messageReaction._emoji.id || messageReaction._emoji.name]; // eslint-disable-line
        if (messageReaction.me) return undefined;
        if (!data || !emoji) return undefined;
        const member = message.guild.member(user);

        if (type.toLowerCase() === "add") member.roles.add(emoji);
        if (type.toLowerCase() === "remove") member.roles.remove(emoji);

        return undefined;
    }
}

module.exports = new ReactionRoleClient();