# Discord Quest Script - Completar Quests Infinitas 🎉

![Discord Logo](https://assets-global.website-files.com/6257adef7f8b8e50c55dc6a0/6257adef7f8b8e2d0b55dc73_Discord-Logo%2BWordmark-Color.svg)  
*(Um script simples para ajudar a completar quests do Discord de forma automática, sem precisar jogar ou instalar jogos!)*

## 📖 O que é isso?

Esse script é um código JavaScript que você cola no console do Discord para **completar quests automaticamente**.  

As **Quests do Discord** são missões temporárias que dão recompensas legais, como:
- Decorações de avatar exclusivas 🖼️
- Orbs (moeda virtual do Discord) 💰
- Itens em jogos
- Às vezes até Nitro grátis ou trials!

Muitas quests pedem para você jogar ou transmitir um jogo específico por alguns minutos. Esse script "engana" o Discord fazendo ele pensar que você está jogando/transmitindo, completando a quest rapidinho! 🚀

> **Atenção importante**: Isso não é "infinito" de verdade (as quests são limitadas pelo Discord), mas você pode completar várias seguidas sem esforço. Use com cuidado!

## ⚠️ Avisos e Riscos

- **Use por sua conta e risco!** Modificar o cliente do Discord pode violar os Termos de Serviço. Muitos usam e não acontece nada, mas o Discord pode detectar e banir contas (raro, mas possível).
- **Não use na conta principal** se você tiver medo. Teste em uma conta secundária primeiro.
- O script **não aceita quests automaticamente** (para evitar captchas).
- Não modifique o script para acelerar muito, isso aumenta o risco de detecção.
- Sempre use a versão mais atualizada do script, pois o Discord atualiza e quebra coisas frequentemente.

## 🛠️ Requisitos

- Computador com **Discord Desktop App** instalado (não funciona mais no navegador para quests de jogo/transmissão).
- Recomendado: Baixe o **Discord PTB** (versão de teste) ou **Canary**, pois neles o console de desenvolvedor funciona melhor:  
  [Baixar Discord PTB](https://discord.com/api/download/ptb?platform=win)

## 📝 Como Usar (Passo a Passo Super Fácil)

1. **Abra o Discord** (de preferência PTB ou Canary).
2. Vá em **Descobrir > Quests** (ou Configurações > Inventário de Presentes).
3. **Aceite a quest** que você quer completar (clique em "Aceitar").
4. Entre em um **canal de voz** (qualquer um, até sozinho ou com uma conta alt para quests de stream).
5. Pressione **Ctrl + Shift + I** para abrir as Ferramentas de Desenvolvedor.
6. Clique na aba **Console**.
7. Se aparecer "pasting blocked", digite `allow pasting` e pressione Enter.
8. **Cole o código do script** (encontre a versão mais recente abaixo) e pressione Enter.
9. Veja as mensagens no console: ele vai mostrar o progresso (ex: "Quest progress: 300/900").
10. Espere o tempo necessário (geralmente 15 minutos) – você pode minimizar o Discord!
11. Quando completar, volte nas Quests e **reivindique a recompensa**.

> Dica: Para múltiplas quests, use versões "improved" que completam uma por uma automaticamente.

## 🔗 Onde Pegar o Script Atualizado?

O script mais famoso e atualizado é esse (de dezembro 2025 ainda funciona em muitas versões):
```
delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();
let wpCache = wpRequire.c;
let ApplicationStreamingStore = Object.values(wpCache).find(x => x?.exports?.Z?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.Z;
let RunningGameStore = Object.values(wpCache).find(x => x?.exports?.ZP?.getRunningGames)?.exports?.ZP;
let QuestsStore = Object.values(wpCache).find(x => x?.exports?.Z?.__proto__?.getQuest)?.exports?.Z;
let ChannelStore = Object.values(wpCache).find(x => x?.exports?.Z?.__proto__?.getAllThreadsForParent)?.exports?.Z;
let GuildChannelStore = Object.values(wpCache).find(x => x?.exports?.ZP?.getSFWDefaultChannel)?.exports?.ZP;
let FluxDispatcher = Object.values(wpCache).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue)?.exports?.Z;
let api = Object.values(wpCache).find(x => x?.exports?.tn?.get)?.exports?.tn;

if (!QuestsStore || !api) {
    throw new Error("Required modules not found");
}

const createGUI = () => {
    const existingGUI = document.getElementById('discord-quests-gui');
    if (existingGUI) existingGUI.remove();
    const existingNotificationContainer = document.getElementById('notification-container');
    if (existingNotificationContainer) existingNotificationContainer.remove();

    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        :root {
            --color-success: #4CAF50;
            --color-error: #F44336;
            --color-warning: #FF9800;
            --color-info: #2196F3;
            --color-text: #333;
            --color-bg-light: #fff;
            --shadow-light: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        #notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
            pointer-events: none;
        }
        .notification {
            pointer-events: auto;
            margin-bottom: 10px;
            padding: 15px 20px;
            border-radius: 8px;
            color: var(--color-text);
            background-color: var(--color-bg-light);
            box-shadow: var(--shadow-light);
            position: relative;
            overflow: hidden;
            transition: opacity 0.5s ease-out, transform 0.5s ease-out, margin-top 0.5s ease-out, max-height 0.5s ease-out, padding 0.5s ease-out;
        }
        .notification.success { border-left: 5px solid var(--color-success); background-color: #f8fff8; }
        .notification.error { border-left: 5px solid var(--color-error); background-color: #fff8f8; }
        .notification.warning { border-left: 5px solid var(--color-warning); background-color: #fffaf0; }
        .notification.info { border-left: 5px solid var(--color-info); background-color: #f8fcff; }
        .notification.entering { opacity: 0; transform: translateX(100%); }
        .notification:not(.entering) { opacity: 1; transform: translateX(0); }
        .notification.leaving {
            opacity: 0;
            transform: translateX(100%);
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-top: 0;
            margin-bottom: 0;
            border-width: 0;
            overflow: hidden;
        }
        .notification-content { display: flex; align-items: flex-start; gap: 10px; }
        .notification-icon { font-size: 20px; min-width: 20px; }
        .notification-message { flex: 1; }
        .notification-title { font-weight: bold; margin-bottom: 2px; font-size: 14px; }
        .notification-text { font-size: 13px; color: #666; }
        .notification-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #999;
            padding: 2px;
            border-radius: 4px;
            transition: color 0.2s;
        }
        .notification-close:hover { color: #333; background: #f0f0f0; }
    `;
    document.head.appendChild(notificationStyle);

    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);

    const showNotification = (type, title, message, duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type} entering`;
        const iconMap = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${iconMap[type] || 'ℹ️'}</div>
                <div class="notification-message">
                    <div class="notification-title">${title}</div>
                    <div class="notification-text">${message}</div>
                </div>
                <button class="notification-close">×</button>
            </div>
        `;
        notificationContainer.appendChild(notification);
        void notification.offsetWidth;
        notification.classList.remove('entering');
        const removeNotification = () => {
            notification.classList.add('leaving');
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 500);
        };
        notification.querySelector('.notification-close').addEventListener('click', removeNotification);
        if (duration > 0) setTimeout(removeNotification, duration);
        return { notification, update: (newTitle, newMessage) => {
            notification.querySelector('.notification-title').textContent = newTitle;
            notification.querySelector('.notification-text').textContent = newMessage;
        }, close: removeNotification };
    };

    const style = document.createElement('style');
    style.textContent = `
        #discord-quests-gui {
            position: fixed;
            top: 80px;
            right: 20px;
            background: #2f3136;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            z-index: 9998;
            width: 400px;
            max-height: 80vh;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid #4f545c;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }
        #discord-quests-gui.minimized {
            height: 40px;
            max-height: 40px;
            overflow: hidden;
        }
        .gui-header {
            background: #36393f;
            padding: 15px;
            border-bottom: 1px solid #4f545c;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            position: relative;
        }
        .gui-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
        }
        .gui-title {
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }
        .close-btn, .minimize-btn {
            background: none;
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .close-btn:hover { background: #ed4245; }
        .minimize-btn:hover { background: #4f545c; }
        .quests-container {
            padding: 15px;
            max-height: 60vh;
            overflow-y: auto;
            flex: 1;
            transition: opacity 0.3s ease;
        }
        #discord-quests-gui.minimized .quests-container,
        #discord-quests-gui.minimized .controls {
            opacity: 0;
            pointer-events: none;
            height: 0;
            padding: 0;
            margin: 0;
        }
        .quest-item {
            background: #36393f;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
            border: 1px solid #4f545c;
            transition: all 0.2s;
            cursor: pointer;
        }
        .quest-item:hover { border-color: #5865f2; }
        .quest-item.selected { border-color: #5865f2; background: #313338; box-shadow: 0 0 5px rgba(88, 101, 242, 0.3); }
        .quest-name {
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .quest-app { color: #7289da; font-size: 12px; margin-bottom: 5px; }
        .quest-progress { color: #b9bbbe; font-size: 12px; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
        .quest-type {
            color: #43b581;
            font-size: 11px;
            background: rgba(67, 181, 129, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #4f545c;
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #5865f2;
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        .controls {
            padding: 15px;
            background: #313338;
            border-top: 1px solid #4f545c;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: opacity 0.3s ease;
        }
        .btn {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-primary { background: #5865f2; }
        .btn-primary:hover { background: #4752c4; }
        .btn-secondary { background: #4f545c; }
        .btn-secondary:hover { background: #5d626a; }
        .btn-danger { background: #ed4245; }
        .btn-danger:hover { background: #f04747; }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .status-log {
            padding: 10px;
            background: #2b2d31;
            border-radius: 4px;
            max-height: 150px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            color: #b9bbbe;
            margin-bottom: 10px;
            border: 1px solid #4f545c;
        }
        .log-entry { margin: 2px 0; padding-left: 15px; border-left: 2px solid #5865f2; font-size: 12px; }
        .log-success { color: #43b581; border-left-color: #43b581; }
        .log-error { color: #ed4245; border-left-color: #ed4245; }
        .log-warning { color: #faa61a; border-left-color: #faa61a; }
        .refresh-btn {
            background: none;
            border: none;
            color: #b9bbbe;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            font-size: 16px;
        }
        .refresh-btn:hover { color: white; }
        .multi-select {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #b9bbbe;
            font-size: 13px;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #4f545c;
        }
        .checkbox { width: 16px; height: 16px; cursor: pointer; }
        .no-quests { color: #b9bbbe; text-align: center; padding: 20px; font-style: italic; }
        .loading { color: #b9bbbe; text-align: center; padding: 20px; font-style: italic; }
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = 'discord-quests-gui';
    gui.innerHTML = `
        <div class="gui-header">
            <div class="gui-title">
                <i>🎮</i>
                <span>Discord Quests Manager</span>
            </div>
            <div class="gui-controls">
                <button class="minimize-btn" title="Minimize">−</button>
                <button class="close-btn" title="Close">×</button>
            </div>
        </div>
        <div class="quests-container">
            <div class="multi-select">
                <input type="checkbox" class="checkbox select-all" id="select-all">
                <label for="select-all">Select All Quests</label>
                <button class="refresh-btn" title="Refresh quests">🔄</button>
            </div>
            <div class="quests-list" id="quests-list">
                <div class="loading">Loading quests...</div>
            </div>
        </div>
        <div class="controls">
            <div class="status-log" id="status-log"></div>
            <button class="btn btn-primary" id="start-btn" disabled>
                <i>🚀</i> Start Selected Quests
            </button>
            <button class="btn btn-danger" id="stop-btn" disabled>
                <i>🛑</i> Stop All Quests
            </button>
        </div>
    `;
    document.body.appendChild(gui);

    let activeQuests = new Map();
    let isDragging = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    const logMessage = (message, type = 'info') => {
        const logElement = document.getElementById('status-log');
        if (!logElement) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${type === 'success' ? 'log-success' : type === 'error' ? 'log-error' : type === 'warning' ? 'log-warning' : ''}`;
        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `<span style="color:#999; margin-right:8px;">[${timestamp}]</span> ${message}`;
        logElement.appendChild(entry);
        logElement.scrollTop = logElement.scrollHeight;
    };

    const updateStartButton = () => {
        const anySelected = document.querySelectorAll('.quest-checkbox:checked').length > 0;
        document.getElementById('start-btn').disabled = !anySelected;
    };

    const loadQuests = () => {
        const questsList = document.getElementById('quests-list');
        questsList.innerHTML = '<div class="loading">Loading quests...</div>';
        try {
            const quests = [...QuestsStore.quests.values()].filter(quest => 
                quest.id !== "1412491570820812933" &&
                quest.userStatus?.enrolledAt && 
                !quest.userStatus?.completedAt && 
                new Date(quest.config.expiresAt).getTime() > Date.now()
            );
            if (quests.length === 0) {
                questsList.innerHTML = '<div class="no-quests">No uncompleted quests found!</div>';
                document.getElementById('start-btn').disabled = true;
                showNotification('info', 'No Quests', 'No uncompleted quests found.', 3000);
                return;
            }
            questsList.innerHTML = '';
            quests.forEach(quest => {
                const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
                const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks[x] != null);
                if (!taskName) return;
                const secondsNeeded = taskConfig.tasks[taskName].target;
                let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;
                if (quest.config.configVersion === 1 && (taskName === "STREAM_ON_DESKTOP" || taskName === "PLAY_ON_DESKTOP")) {
                    secondsDone = quest.userStatus?.streamProgressSeconds ?? 0;
                }
                const progress = Math.min(100, Math.round((secondsDone / secondsNeeded) * 100));
                const timeLeft = Math.ceil((secondsNeeded - secondsDone) / 60);
                const timeLeftText = timeLeft > 0 ? `${timeLeft}min` : '<1min';
                const questElement = document.createElement('div');
                questElement.className = 'quest-item';
                questElement.innerHTML = `
                    <div class="quest-name">
                        <input type="checkbox" class="checkbox quest-checkbox" data-quest-id="${quest.id}">
                        ${quest.config.messages.questName}
                    </div>
                    <div class="quest-app">🎮 ${quest.config.application.name}</div>
                    <div class="quest-progress">
                        ⏱️ ${Math.floor(secondsDone)}/${secondsNeeded}s (${progress}%) • ${timeLeftText} left
                    </div>
                    <div class="quest-type">${taskName.replace(/_/g, ' ')}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                `;
                questsList.appendChild(questElement);
                questElement.addEventListener('click', (e) => {
                    if (e.target !== questElement.querySelector('.quest-checkbox')) {
                        const checkbox = questElement.querySelector('.quest-checkbox');
                        checkbox.checked = !checkbox.checked;
                        questElement.classList.toggle('selected', checkbox.checked);
                        updateStartButton();
                    }
                });
            });
            document.querySelectorAll('.quest-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function(e) {
                    e.stopPropagation();
                    this.closest('.quest-item').classList.toggle('selected', this.checked);
                    updateStartButton();
                });
            });
            updateStartButton();
            showNotification('success', 'Quests Loaded', `${quests.length} quests found.`, 2000);
        } catch (error) {
            questsList.innerHTML = `<div class="no-quests">Error loading quests: ${error.message}</div>`;
            logMessage(`❌ Error loading quests: ${error.message}`, 'error');
            showNotification('error', 'Error Loading Quests', error.message, 5000);
        }
    };

    const stopAllQuests = () => {
        activeQuests.forEach((questData, questId) => {
            if (questData.interval) clearInterval(questData.interval);
            if (questData.timeout) clearTimeout(questData.timeout);
            if (questData.abortController) questData.abortController.abort();
        });
        activeQuests.clear();
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.querySelectorAll('.quest-checkbox').forEach(cb => cb.disabled = false);
        document.querySelectorAll('.quest-item').forEach(item => item.style.opacity = '1');
        logMessage('🛑 All quests stopped!', 'warning');
        showNotification('info', 'Quests Stopped', 'All quests have been stopped.', 3000);
    };

    const startSelectedQuests = () => {
        const selectedQuests = [];
        document.querySelectorAll('.quest-checkbox:checked').forEach(checkbox => {
            const questId = checkbox.dataset.questId;
            const quest = [...QuestsStore.quests.values()].find(q => q.id === questId);
            if (quest) selectedQuests.push(quest);
        });
        if (selectedQuests.length === 0) return;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        document.querySelectorAll('.quest-checkbox').forEach(cb => {
            cb.disabled = true;
            if (cb.checked) {
                const item = cb.closest('.quest-item');
                if (item) item.style.opacity = '0.7';
            }
        });
        logMessage(`🚀 Starting ${selectedQuests.length} quest(s)...`, 'success');
        showNotification('info', 'Starting Quests', `Starting ${selectedQuests.length} quest(s)...`, 3000);
        selectedQuests.forEach(quest => {
            processQuest(quest).then(() => {
                const checkbox = document.querySelector(`.quest-checkbox[data-quest-id="${quest.id}"]`);
                if (checkbox) {
                    const item = checkbox.closest('.quest-item');
                    if (item) item.style.opacity = '1';
                    checkbox.disabled = false;
                    checkbox.checked = false;
                    item.classList.remove('selected');
                }
                updateStartButton();
            }).catch(error => {
                logMessage(`❌ Error in quest "${quest.config.messages.questName}": ${error.message}`, 'error');
                showNotification('error', 'Quest Failed', `${quest.config.messages.questName}: ${error.message}`, 5000);
                const checkbox = document.querySelector(`.quest-checkbox[data-quest-id="${quest.id}"]`);
                if (checkbox) {
                    const item = checkbox.closest('.quest-item');
                    if (item) item.style.opacity = '1';
                    checkbox.disabled = false;
                    checkbox.checked = false;
                    item.classList.remove('selected');
                }
                updateStartButton();
            });
        });
    };

    const processQuest = async (quest) => {
        if (activeQuests.has(quest.id)) {
            throw new Error(`Quest "${quest.config.messages.questName}" is already running`);
        }
        const isApp = typeof DiscordNative !== "undefined";
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks[x] != null);
        if (!taskName) {
            throw new Error(`Unsupported task type for quest "${quest.config.messages.questName}"`);
        }
        const secondsNeeded = taskConfig.tasks[taskName].target;
        let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;
        if (quest.config.configVersion === 1 && (taskName === "STREAM_ON_DESKTOP" || taskName === "PLAY_ON_DESKTOP")) {
            secondsDone = quest.userStatus?.streamProgressSeconds ?? 0;
        }
        logMessage(`🎯 Starting quest: "${quest.config.messages.questName}" (${taskName})`, 'success');
        showNotification('info', 'Quest Started', `${quest.config.messages.questName} - ${taskName.replace(/_/g, ' ')}`, 3000);
        const questData = {
            startTime: Date.now(),
            lastProgress: secondsDone,
            interval: null,
            timeout: null,
            abortController: new AbortController()
        };
        activeQuests.set(quest.id, questData);
        try {
            if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                await processVideoQuest(quest, secondsNeeded, secondsDone, questData);
            } else if (taskName === "PLAY_ON_DESKTOP") {
                if (!isApp) {
                    throw new Error("Desktop quests only work in Discord Desktop App. Please use the desktop application.");
                }
                await processPlayDesktopQuest(quest, secondsNeeded, secondsDone, questData);
            } else if (taskName === "STREAM_ON_DESKTOP") {
                if (!isApp) {
                    throw new Error("Stream quests only work in Discord Desktop App. Please use the desktop application.");
                }
                await processStreamDesktopQuest(quest, secondsNeeded, secondsDone, questData);
            } else if (taskName === "PLAY_ACTIVITY") {
                await processPlayActivityQuest(quest, secondsNeeded, secondsDone, questData);
            }
        } finally {
            activeQuests.delete(quest.id);
        }
    };

    const processVideoQuest = async (quest, secondsNeeded, secondsDone, questData) => {
        const maxFuture = 10, speed = 7, interval = 1;
        const enrolledAt = new Date(quest.userStatus.enrolledAt).getTime();
        let completed = false;
        let currentProgress = secondsDone;
        while (currentProgress < secondsNeeded && !completed && !questData.abortController.signal.aborted) {
            const maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + maxFuture;
            const diff = maxAllowed - currentProgress;
            const timestamp = currentProgress + speed;
            if (diff >= speed) {
                try {
                    const res = await api.post({
                        url: `/quests/${quest.id}/video-progress`,
                        body: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) }
                    });
                    completed = res.body.completed_at != null;
                    currentProgress = Math.min(secondsNeeded, timestamp);
                    logMessage(`📺 "${quest.config.messages.questName}": ${Math.floor(currentProgress)}/${secondsNeeded}s (${Math.round((currentProgress/secondsNeeded)*100)}%)`, 'success');
                    const questElement = document.querySelector(`.quest-checkbox[data-quest-id="${quest.id}"]`)?.closest('.quest-item');
                    if (questElement) {
                        const progressFill = questElement.querySelector('.progress-fill');
                        const progressText = questElement.querySelector('.quest-progress');
                        if (progressFill && progressText) {
                            const progressPercent = Math.round((currentProgress/secondsNeeded)*100);
                            progressFill.style.width = `${progressPercent}%`;
                            const timeLeft = Math.ceil((secondsNeeded - currentProgress) / 60);
                            progressText.innerHTML = `⏱️ ${Math.floor(currentProgress)}/${secondsNeeded}s (${progressPercent}%) • ${timeLeft > 0 ? `${timeLeft}min` : '<1min'} left`;
                        }
                    }
                } catch (error) {
                    if (!questData.abortController.signal.aborted) throw error;
                }
            }
            if (timestamp >= secondsNeeded || completed) break;
            await new Promise(resolve => setTimeout(resolve, interval * 1000));
        }
        if (!completed && currentProgress < secondsNeeded && !questData.abortController.signal.aborted) {
            try {
                await api.post({
                    url: `/quests/${quest.id}/video-progress`,
                    body: { timestamp: secondsNeeded }
                });
            } catch (error) {
                if (!questData.abortController.signal.aborted) throw error;
            }
        }
        if (!questData.abortController.signal.aborted) {
            logMessage(`✅ Video quest "${quest.config.messages.questName}" completed!`, 'success');
            showNotification('success', 'Quest Completed', `${quest.config.messages.questName}`, 3000);
        }
    };

    const processPlayDesktopQuest = async (quest, secondsNeeded, secondsDone, questData) => {
        try {
            const res = await api.get({ url: `/applications/public?application_ids=${quest.config.application.id}` });
            const appData = res.body[0];
            const exeName = appData.executables.find(x => x.os === "win32")?.name?.replace(">", "") || "game.exe";
            const pid = Math.floor(Math.random() * 30000) + 1000;
            const fakeGame = {
                cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                exeName,
                exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                hidden: false,
                isLauncher: false,
                id: quest.config.application.id,
                name: appData.name,
                pid: pid,
                pidPath: [pid],
                processName: appData.name,
                start: Date.now(),
            };
            const realGames = RunningGameStore.getRunningGames?.() || [];
            const fakeGames = [fakeGame];
            const realGetRunningGames = RunningGameStore.getRunningGames;
            const realGetGameForPID = RunningGameStore.getGameForPID;
            RunningGameStore.getRunningGames = () => fakeGames;
            RunningGameStore.getGameForPID = (pid) => fakeGames.find(x => x.pid === pid);
            FluxDispatcher.dispatch?.({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames });
            let progress = secondsDone;
            const updateProgress = () => {
                if (questData.abortController.signal.aborted) {
                    cleanupPlayDesktopQuest(realGetRunningGames, realGetGameForPID, fakeGame);
                    return;
                }
                progress += 60;
                logMessage(`🎮 "${quest.config.messages.questName}": ${Math.floor(progress)}/${secondsNeeded}s (${Math.round((progress/secondsNeeded)*100)}%)`, 'success');
                const questElement = document.querySelector(`.quest-checkbox[data-quest-id="${quest.id}"]`)?.closest('.quest-item');
                if (questElement) {
                    const progressFill = questElement.querySelector('.progress-fill');
                    const progressText = questElement.querySelector('.quest-progress');
                    if (progressFill && progressText) {
                        const progressPercent = Math.min(100, Math.round((progress/secondsNeeded)*100));
                        progressFill.style.width = `${progressPercent}%`;
                        const timeLeft = Math.ceil((secondsNeeded - progress) / 60);
                        progressText.innerHTML = `⏱️ ${Math.floor(progress)}/${secondsNeeded}s (${progressPercent}%) • ${timeLeft > 0 ? `${timeLeft}min` : '<1min'} left`;
                    }
                }
                if (progress >= secondsNeeded || questData.abortController.signal.aborted) {
                    clearInterval(questData.interval);
                    cleanupPlayDesktopQuest(realGetRunningGames, realGetGameForPID, fakeGame);
                    if (!questData.abortController.signal.aborted) {
                        logMessage(`✅ Play desktop quest "${quest.config.messages.questName}" completed!`, 'success');
                        showNotification('success', 'Quest Completed', `${quest.config.messages.questName}`, 3000);
                    }
                }
            };
            questData.interval = setInterval(updateProgress, 60000);
            updateProgress();
        } catch (error) {
            try {
                cleanupPlayDesktopQuest?.(RunningGameStore.getRunningGames, RunningGameStore.getGameForPID, { pid: Math.floor(Math.random() * 30000) + 1000 });
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
            throw error;
        }
    };

    const cleanupPlayDesktopQuest = (realGetRunningGames, realGetGameForPID, fakeGame) => {
        try {
            RunningGameStore.getRunningGames = realGetRunningGames;
            RunningGameStore.getGameForPID = realGetGameForPID;
            FluxDispatcher.dispatch?.({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: [] });
        } catch (error) {
            console.error('Error cleaning up play desktop quest:', error);
        }
    };

    const processStreamDesktopQuest = async (quest, secondsNeeded, secondsDone, questData) => {
        const pid = Math.floor(Math.random() * 30000) + 1000;
        let realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
            id: quest.config.application.id,
            pid,
            sourceName: null
        });
        let progress = secondsDone;
        const updateProgress = () => {
            if (questData.abortController.signal.aborted) {
                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                return;
            }
            progress += 60;
            logMessage(`🎥 "${quest.config.messages.questName}": ${Math.floor(progress)}/${secondsNeeded}s (${Math.round((progress/secondsNeeded)*100)}%)`, 'success');
            const questElement = document.querySelector(`.quest-checkbox[data-quest-id="${quest.id}"]`)?.closest('.quest-item');
            if (questElement) {
                const progressFill = questElement.querySelector('.progress-fill');
                const progressText = questElement.querySelector('.quest-progress');
                if (progressFill && progressText) {
                    const progressPercent = Math.min(100, Math.round((progress/secondsNeeded)*100));
                    progressFill.style.width = `${progressPercent}%`;
                    const timeLeft = Math.ceil((secondsNeeded - progress) / 60);
                    progressText.innerHTML = `⏱️ ${Math.floor(progress)}/${secondsNeeded}s (${progressPercent}%) • ${timeLeft > 0 ? `${timeLeft}min` : '<1min'} left`;
                }
            }
            if (progress >= secondsNeeded || questData.abortController.signal.aborted) {
                clearInterval(questData.interval);
                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                if (!questData.abortController.signal.aborted) {
                    logMessage(`✅ Stream desktop quest "${quest.config.messages.questName}" completed!`, 'success');
                    showNotification('success', 'Quest Completed', `${quest.config.messages.questName}`, 3000);
                }
            }
        };
        questData.interval = setInterval(updateProgress, 60000);
        updateProgress();
        logMessage(`💡 Stream quest "${quest.config.messages.questName}": You need at least 1 other person in the VC!`, 'warning');
        showNotification('warning', 'Stream Quest', 'You need at least 1 other person in the VC for stream quests to work!', 5000);
    };

    const processPlayActivityQuest = async (quest, secondsNeeded, secondsDone, questData) => {
        let channelId;
        try {
            channelId = ChannelStore.getSortedPrivateChannels?.()?.[0]?.id || 
                       Object.values(GuildChannelStore.getAllGuilds?.() || {}).find(x => x?.VOCAL?.length > 0)?.VOCAL?.[0]?.id;
        } catch (error) {
            const allGuilds = GuildChannelStore.getAllGuilds?.() || {};
            for (const guild of Object.values(allGuilds)) {
                if (guild?.VOCAL?.length > 0) {
                    channelId = guild.VOCAL[0].id;
                    break;
                }
            }
        }
        if (!channelId) {
            throw new Error("Could not find a suitable voice channel. Please join a voice channel first.");
        }
        const streamKey = `call:${channelId}:1`;
        let progress = secondsDone;
        while (progress < secondsNeeded && !questData.abortController.signal.aborted) {
            try {
                const res = await api.post({
                    url: `/quests/${quest.id}/heartbeat`,
                    body: { stream_key: streamKey, terminal: false }
                });
                progress = res.body.progress?.PLAY_ACTIVITY?.value || progress;
                logMessage(`🎯 "${quest.config.messages.questName}": ${Math.floor(progress)}/${secondsNeeded}s (${Math.round((progress/secondsNeeded)*100)}%)`, 'success');
                const questElement = document.querySelector(`.quest-checkbox[data-quest-id="${quest.id}"]`)?.closest('.quest-item');
                if (questElement) {
                    const progressFill = questElement.querySelector('.progress-fill');
                    const progressText = questElement.querySelector('.quest-progress');
                    if (progressFill && progressText) {
                        const progressPercent = Math.min(100, Math.round((progress/secondsNeeded)*100));
                        progressFill.style.width = `${progressPercent}%`;
                        const timeLeft = Math.ceil((secondsNeeded - progress) / 60);
                        progressText.innerHTML = `⏱️ ${Math.floor(progress)}/${secondsNeeded}s (${progressPercent}%) • ${timeLeft > 0 ? `${timeLeft}min` : '<1min'} left`;
                    }
                }
                if (progress >= secondsNeeded || questData.abortController.signal.aborted) {
                    if (!questData.abortController.signal.aborted) {
                        await api.post({
                            url: `/quests/${quest.id}/heartbeat`,
                            body: { stream_key: streamKey, terminal: true }
                        });
                        logMessage(`✅ Activity quest "${quest.config.messages.questName}" completed!`, 'success');
                        showNotification('success', 'Quest Completed', `${quest.config.messages.questName}`, 3000);
                    }
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 20000));
            } catch (error) {
                if (!questData.abortController.signal.aborted) throw error;
            }
        }
    };

    const header = gui.querySelector('.gui-header');
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        if (e.target !== header && !e.target.closest('.gui-title') && !e.target.closest('.gui-controls')) return;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === header || e.target.closest('.gui-title') || e.target.closest('.gui-controls')) {
            isDragging = true;
            header.style.cursor = 'grabbing';
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        header.style.cursor = 'grab';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, gui);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    gui.querySelector('.close-btn').addEventListener('click', () => {
        gui.remove();
        notificationContainer.remove();
    });
    
    gui.querySelector('.minimize-btn').addEventListener('click', () => {
        gui.classList.toggle('minimized');
    });
    
    gui.querySelector('#select-all').addEventListener('change', function() {
        document.querySelectorAll('.quest-checkbox').forEach(checkbox => {
            checkbox.checked = this.checked;
            checkbox.closest('.quest-item').classList.toggle('selected', this.checked);
        });
        updateStartButton();
    });

    gui.querySelector('#start-btn').addEventListener('click', startSelectedQuests);
    gui.querySelector('#stop-btn').addEventListener('click', stopAllQuests);
    gui.querySelector('.refresh-btn').addEventListener('click', () => {
        loadQuests();
        showNotification('info', 'Refreshing', 'Loading quests...', 2000);
    });

    setTimeout(loadQuests, 100);
    logMessage('✅ Discord Quests Manager loaded successfully!', 'success');
    showNotification('success', 'GUI Loaded', 'Discord Quests Manager is ready!', 3000);
};

try {
    createGUI();
} catch (error) {
    console.error('❌ Error initializing Discord Quests Manager:', error);
    alert(`Error initializing Discord Quests Manager: ${error.message}\n\nPlease make sure you are running this in the Discord Desktop App.`);
}```


Copie o código inteiro da página e cole no console!

Se não funcionar, procure no GitHub por "discord quest completer" – tem várias versões.

## ❓ Perguntas Frequentes (FAQ)

**Não abre o console com Ctrl + Shift + I?**  
→ Use Discord PTB ou Canary.

**Diz "This no longer works in browser"?**  
→ Sim, use só o app desktop!

**Preciso de alguém assistindo a stream?**  
→ Para quests de stream, sim – use uma conta alternativa no canal de voz.

**Quanto tempo demora?**  
→ O tempo da quest (ex: 15 min), mas você não precisa fazer nada.

**É seguro?**  
→ Milhares usam, mas não é 100% garantido. Não abuse!

## ❤️ Contribua ou Atualize

Se o script quebrou, procure atualizações no Reddit (r/discordapp) ou GitHub.  
Se você melhorar, compartilhe! 😊

Divirta-se completando quests e pegando aquelas recompensas exclusivas! ✨

Feito com ❤️ para a comunidade Discord BR.  
Qualquer dúvida, pergunte! 🚀
