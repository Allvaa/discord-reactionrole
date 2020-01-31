const { Client } = require("discord.js");

/**
 * @class ReactionRoleClient
 * @extends {Client}
 */
class ReactionRoleClient extends Client {
    /**
     * Creates an instance of ReactionRoleClient.
     * @param {import("discord.js").ClientOptions} [options]
     * @memberof ReactionRoleClient
     */
    constructor(options) {
        super(options);
        this.config = require("./config.json"); // eslint-disable-line
        this.data = require("./data.json"); // eslint-disable-line

        this.on("ready", async () => {
            console.log(`[INFO] Logged in as ${this.user.tag}.`);
            // eslint-disable-next-line no-restricted-syntax
            for (const data of Object.values(this.data)) {
                try {
                    await this.channels.get(data.channelID).messages.fetch(data.messageID); // eslint-disable-line
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

    /**
     * @param {import("discord.js").MessageReaction} messageReaction
     * @param {import("discord.js").User} user
     * @param {String} type
     * @returns {void} Void
     * @memberof ReactionRoleClient
     */
    handleRole(messageReaction, user, type) {
        if (!type || !["add", "remove"].includes(type.toLowerCase())) return undefined;
        const { message } = messageReaction;
        const data = this.data[message.id];
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