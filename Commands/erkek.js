const { MessageEmbed } = require('discord.js');
const qdb = require("quick.db");
const rdb = new qdb.table("teyitler");
const kdb = new qdb.table("kullanici");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setTimestamp().setColor("RANDOM").setFooter(`AETHER`);
    if (!message.member.roles.cache.has(ayar.kayitSorumlusu) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komutu kullanmak için yeterli yetkiye sahip değilsin`)).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let isim = args[1];
    let yaş = Number (args[2]);

    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Kayıt etmeye çalıştığın kişi seninle aynı yetkide veya senden daha üstte olduğu için işlemi gerçekleştiremedim.`)).then(x => x.delete({timeout: 10000}));
    if (!member || !isim || !yaş) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın. \`Örnek: ${ayar.prefix || '.'}e @üye isim yaş\``)).then(x => x.delete({timeout: 10000}));

            member.setNickname(`${ayar.tag || ""} ${isim} | ${yaş}`).catch();
            if (message.guild.roles.cache.has(ayar.erkekRol1)) {
                member.roles.cache.has(ayar.boosterRol) ? member.roles.set([ayar.boosterRol, ayar.erkekRol1]) : member.roles.set([ayar.erkekRol1]);
            }

            if (member.user.username.includes(ayar.tag) && !member.roles.cache.has(ayar.ekipRolu)) {
                member.roles.add(ayar.ekipRolu);
            }

            rdb.add(`reg.${message.author.id}.erkek`, +1);
            kdb.push(`isimler.${member.id}`, {
                guildName: `${ayar.tag || ""} ${isim} | ${yaş}`,
                Name: isim,
                Age: yaş,
                Zaman: Date.now(),
                Yetkili: message.author.id,
                Komut: "Erkek"
            });
}

module.exports.configuration = {
    name: "erkek",
    aliases: ["e"],
    usage: "erkek @üye [isim] [yaş]",
    description: "Belirtilen üyeyi sunucuya erkek olarak kaydını gerçekleştirmiş olursunuz."
};
