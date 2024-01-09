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
            const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Você é um assistente de linguagem.' },
                    { role: 'user', content: question }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`
                }
            });
    
            console.log('Resposta:', resposta.data.choices[0].message['content']);
        } catch (error) {
            if (error.response) {
                // A requisição foi feita e o servidor respondeu com um status fora da faixa 2xx
                console.error('Erro de resposta da API:', error.response.data);
            } else if (error.request) {
                // A requisição foi feita, mas não houve resposta do servidor
                console.error('Sem resposta do servidor:', error.request);
            } else {
                // Algo aconteceu ao configurar a requisição que desencadeou um erro
                console.error('Erro ao configurar a requisição:', error.message);
            }
        }
    }
});

client.login(token);
