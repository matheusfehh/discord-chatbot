require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const token = process.env.DISCORD_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;

client.on('ready', () => {
    console.log(`Bot está online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        const question = message.content.replace(`<@!${client.user.id}>`, '').trim();

        try {
            const openaiResponse = await axios.post(
                'https://api.openai.com/v1/engines/davinci/completions',
                {
                    prompt: question,
                    max_tokens: 150,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`,
                    },
                }
            );

            message.channel.send(`Pergunta: ${question}\nResposta: ${openaiResponse.data.choices[0].text}`);
        } catch (error) {
            console.error('Erro ao fazer solicitação à API da OpenAI:', error.message);
            message.channel.send('Ocorreu um erro ao processar sua pergunta.');
        }
    }
});

client.login(token);
