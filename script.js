(() => {
delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

const getModule = (predicate) => {
    for (const x of Object.values(wpRequire.c)) {
        if (!x?.exports) continue;
        if (predicate(x.exports)) return x.exports;
        for (const sub of Object.values(x.exports)) {
            if (sub && predicate(sub)) return sub;
        }
        if (x.exports.default && predicate(x.exports.default)) return x.exports.default;
        if (x.exports.__proto__ && predicate(x.exports.__proto__)) return x.exports.__proto__;
    }
    return null;
};

const findHTTPClient = () => {
    
    try {
        for (const id in wpRequire.m) {
            const src = wpRequire.m[id]?.toString?.();
            if (src && src.includes("HTTPUtils")) {
                const mod = wpRequire(id);
                if (mod) {
                    for (const val of Object.values(mod)) {
                        if (val && typeof val.get === "function" && typeof val.post === "function" && (typeof val.del === "function" || typeof val.delete === "function")) {
                            return val;
                        }
                    }
                }
            }
        }
    } catch (e) {}

    
    try {
        for (const x of Object.values(wpRequire.c)) {
            if (!x?.exports) continue;
            for (const val of [x.exports, ...(x.exports ? Object.values(x.exports) : [])]) {
                if (val && typeof val.get === "function" && typeof val.post === "function" && typeof val.put === "function" && typeof val.patch === "function" && (typeof val.del === "function" || typeof val.delete === "function")) {
                    return val;
                }
            }
        }
    } catch (e) {}

    
    try {
        for (const x of Object.values(wpRequire.c)) {
            if (!x?.exports) continue;
            for (const val of [x.exports, ...(x.exports ? Object.values(x.exports) : [])]) {
                if (val && typeof val.get === "function" && typeof val.post === "function" && (typeof val.del === "function" || typeof val.delete === "function")) {
                    if (typeof val.put === "function" || typeof val.patch === "function") {
                        return val;
                    }
                }
            }
        }
    } catch (e) {}
    return null;
};

const ApplicationStreamingStore = getModule(x => typeof x.getStreamerActiveStreamMetadata === "function")
    ?? Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.A;
const RunningGameStore = getModule(x => typeof x.getRunningGames === "function")
    ?? Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames)?.exports?.Ay;
const QuestsStore = getModule(x => typeof x.getQuest === "function" && x.quests instanceof Map)
    ?? Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;
const ChannelStore = getModule(x => typeof x.getAllThreadsForParent === "function" && typeof x.getSortedPrivateChannels === "function")
    ?? Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent)?.exports?.A;
const GuildChannelStore = getModule(x => typeof x.getSFWDefaultChannel === "function" && typeof x.getAllGuilds === "function")
    ?? Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getSFWDefaultChannel)?.exports?.Ay;
const FluxDispatcher = getModule(x => typeof x.flushWaitQueue === "function" && typeof x.subscribe === "function")
    ?? Object.values(wpRequire.c).find(x => x?.exports?.h?.__proto__?.flushWaitQueue)?.exports?.h;
const api = findHTTPClient()
    ?? Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo;

if (!QuestsStore || !api || !FluxDispatcher) {
    throw new Error("Módulos necessários do Discord não foram encontrados. Certifique-se de injetar após carregar o aplicativo completamente.");
}

const isApp = typeof DiscordNative !== "undefined";
const supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];

const createGUI = () => {
    const existingGUI = document.getElementById('discord-quests-gui');
    if (existingGUI) existingGUI.remove();
    const existingNotificationContainer = document.getElementById('notification-container');
    if (existingNotificationContainer) existingNotificationContainer.remove();

    
    const safeLocalStorage = {
        getItem: (key) => {
            try {
                return (typeof window !== "undefined" && window.localStorage) ? window.localStorage.getItem(key) : null;
            } catch (e) {
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                if (typeof window !== "undefined" && window.localStorage) {
                    window.localStorage.setItem(key, value);
                }
            } catch (e) {}
        }
    };

    let currentLang = 'en';
    const locales = {
        en: {
            title: "Discord Hub",
            questsTab: "Quests",
            hypesquadTab: "HypeSquad",
            selectAll: "Select All",
            refreshQuests: "Refresh Quests",
            hypesquadDesc: "Select a HypeSquad house below and click add. The badge will appear on your profile (refresh to see).",
            houseBravery: "HypeSquad Bravery",
            houseBraveryDesc: "House of Bravery",
            houseBrilliance: "HypeSquad Brilliance",
            houseBrillianceDesc: "House of Brilliance",
            houseBalance: "HypeSquad Balance",
            houseBalanceDesc: "House of Balance",
            addBadge: "Add Badge",
            removeBadge: "Remove Badge",
            startSelected: "Start Selected",
            stopAll: "Stop All",
            confirmTitle: "Are you sure?",
            confirmText: "If you close, you will have to execute the script again to open the Hub!",
            confirmYes: "YES",
            confirmNo: "NO",
            fetchingQuests: "Fetching quests...",
            noQuests: "No active quests found.",
            progressLabel: "Progress",
            readyNotification: "Ready",
            loadedNotification: (count) => `Loaded ${count} available quests.`,
            errorLabel: "Error",
            startedLogs: (count) => `Starting ${count} quests sequentially (stealthier)...`,
            startedNotificationTitle: "Quests Started",
            startedNotificationDesc: "Execution progress running sequentially.",
            runningQuestLog: (name) => `Running: ${name}...`,
            completedQuestLog: (name) => `Quest "${name}" COMPLETED!`,
            completedNotificationTitle: "Quest Completed",
            completedNotificationDesc: (name) => `Successfully finished: ${name}`,
            failedQuestLog: (name, msg) => `Quest "${name}" stopped/failed: ${msg}`,
            failedNotificationTitle: "Quest Failed",
            interruptedLog: "Execution stopped by user.",
            interruptedNotificationTitle: "Interrupted",
            interruptedNotificationDesc: "All quest executions have been stopped.",
            abortedByUser: "Aborted by user",
            unknownTask: "Unknown task type",
            noChannel: "No eligible voice channel found.",
            browserWarning: "[Warning] You are in the browser! Play/stream quests may not work outside the Discord Desktop App.",
            fetchingAppError: "Failed to get app data: ",
            appDataNotFound: "Application data not found.",
            streamJoinVC: (name) => `Spoofing stream of "${name}". Join a voice channel! (Needs another person in the channel)`,
            playSpoofing: (name) => `Spoofing game "${name}". Please wait...`,
            activitySpoofing: (channelId) => `Spoofing activity in channel ${channelId}`,
            progressLog: (current, target) => `Progress: ${current}/${target}s`,
            hypesquadJoining: (id) => `Attempting to join HypeSquad house ${id}...`,
            hypesquadSuccess: (id) => `Success! Joined house ${id}. Restart/Refresh Discord to see the badge.`,
            hypesquadAddToast: "Badge added! Refresh the page (Ctrl+R) to see it on your profile.",
            hypesquadRemoving: "Removing HypeSquad badge...",
            hypesquadRemoveSuccess: "Success! HypeSquad badge removed. Restart/Refresh Discord to update.",
            hypesquadRemoveToast: "Badge removed! Refresh the page (Ctrl+R).",
            questsStoreError: "QuestsStore or quests map not found.",
            questsErrorLog: "Error loading quests: ",
            videoStealthLogs: "Starting real-time video simulation (stealthier). Please wait...",
            videoProgressLog: (curr, tot) => `Video progress: ${curr}/${tot}s`,
            requestErrorLog: (msg) => `Progress request error: ${msg}`,
            playProgressLog: (curr, tot) => `Game progress: ${curr}/${tot}s`,
            streamProgressLog: (curr, tot) => `Stream progress: ${curr}/${tot}s`,
            activityProgressLog: (curr, tot) => `Activity progress: ${curr}/${tot}s`,
            activityHeartbeatError: (msg) => `Activity heartbeat error: ${msg}`,
            hypesquadAddError: (msg) => `Error adding badge: ${msg}`,
            hypesquadRemoveError: (msg) => `Error removing badge: ${msg}`
        },
        pt: {
            title: "Discord Hub",
            questsTab: "Quests",
            hypesquadTab: "HypeSquad",
            selectAll: "Selecionar Todos",
            refreshQuests: "Recarregar Quests",
            hypesquadDesc: "Selecione uma casa da HypeSquad abaixo e clique em adicionar. O emblema aparecerá em seu perfil (atualize para ver).",
            houseBravery: "HypeSquad Bravery",
            houseBraveryDesc: "Casa da Bravura",
            houseBrilliance: "HypeSquad Brilliance",
            houseBrillianceDesc: "Casa do Brilho",
            houseBalance: "HypeSquad Balance",
            houseBalanceDesc: "Casa do Equilíbrio",
            addBadge: "Adicionar Emblema",
            removeBadge: "Remover Emblema",
            startSelected: "Iniciar Selecionadas",
            stopAll: "Parar Tudo",
            confirmTitle: "Tem certeza?",
            confirmText: "Se fechar, você terá que executar o script novamente para abrir o Hub!",
            confirmYes: "SIM",
            confirmNo: "NÃO",
            fetchingQuests: "Buscando quests...",
            noQuests: "Nenhuma quest ativa encontrada.",
            progressLabel: "Progresso",
            readyNotification: "Pronto",
            loadedNotification: (count) => `${count} quests disponíveis carregadas.`,
            errorLabel: "Erro",
            startedLogs: (count) => `Iniciando ${count} quests sequencialmente (mais stealth)...`,
            startedNotificationTitle: "Quests Iniciadas",
            startedNotificationDesc: "Progresso em execução sequencial.",
            runningQuestLog: (name) => `Executando: ${name}...`,
            completedQuestLog: (name) => `Quest "${name}" CONCLUÍDA!`,
            completedNotificationTitle: "Quest Concluída",
            completedNotificationDesc: (name) => `Sucesso em: ${name}`,
            failedQuestLog: (name, msg) => `Quest "${name}" parada/falhou: ${msg}`,
            failedNotificationTitle: "Quest Falhou",
            interruptedLog: "Execução interrompida pelo usuário.",
            interruptedNotificationTitle: "Interrompido",
            interruptedNotificationDesc: "Todas as execuções de quests foram paradas.",
            abortedByUser: "Cancelado pelo usuário",
            unknownTask: "Tipo de tarefa desconhecido",
            noChannel: "Nenhum canal de voz elegível encontrado.",
            browserWarning: "[Aviso] Você está no navegador! Quests de jogar/transmitir podem não funcionar fora do Discord App.",
            fetchingAppError: "Erro ao obter dados do app: ",
            appDataNotFound: "Dados da aplicação não encontrados.",
            streamJoinVC: (name) => `Spoofando transmissão de "${name}". Entre em um canal de voz! (Precisa de outra pessoa no canal)`,
            playSpoofing: (name) => `Spoofando jogo "${name}". Aguarde...`,
            activitySpoofing: (channelId) => `Spoofando atividade no canal ${channelId}`,
            progressLog: (current, target) => `Progresso: ${current}/${target}s`,
            hypesquadJoining: (id) => `Tentando entrar na casa HypeSquad ${id}...`,
            hypesquadSuccess: (id) => `Sucesso! Entrou na casa ${id}. Reinicie/Atualize o Discord para ver o emblema.`,
            hypesquadAddToast: "Emblema adicionado! Recarregue a página (Ctrl+R) para ver no seu perfil.",
            hypesquadRemoving: "Removendo emblema da HypeSquad...",
            hypesquadRemoveSuccess: "Sucesso! Emblema da HypeSquad removido. Reinicie/Atualize o Discord para atualizar.",
            hypesquadRemoveToast: "Emblema removido! Recarregue a página (Ctrl+R).",
            questsStoreError: "QuestsStore ou mapa de quests não encontrado.",
            questsErrorLog: "Erro ao carregar quests: ",
            videoStealthLogs: "Iniciando simulação de vídeo em tempo real (mais stealth). Aguarde...",
            videoProgressLog: (curr, tot) => `Progresso de vídeo: ${curr}/${tot}s`,
            requestErrorLog: (msg) => `Erro na requisição de progresso: ${msg}`,
            playProgressLog: (curr, tot) => `Progresso do jogo: ${curr}/${tot}s`,
            streamProgressLog: (curr, tot) => `Progresso da transmissão: ${curr}/${tot}s`,
            activityProgressLog: (curr, tot) => `Progresso da atividade: ${curr}/${tot}s`,
            activityHeartbeatError: (msg) => `Erro no heartbeat da atividade: ${msg}`,
            hypesquadAddError: (msg) => `Erro ao adicionar emblema: ${msg}`,
            hypesquadRemoveError: (msg) => `Erro ao remover emblema: ${msg}`
        }
    };

    const t = (key, ...args) => {
        const val = locales[currentLang][key];
        if (typeof val === 'function') return val(...args);
        return val;
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
            --bg-primary: rgba(8, 8, 8, 0.88);
            --bg-secondary: rgba(14, 14, 14, 0.75);
            --bg-tertiary: rgba(22, 22, 22, 0.6);
            --bg-solid-primary: #080808;
            --bg-solid-secondary: #121212;
            --accent: #ef4444;
            --accent-hover: #f87171;
            --accent-soft: rgba(239, 68, 68, 0.12);
            --accent-glow: rgba(239, 68, 68, 0.22);
            --accent-glow-strong: rgba(239, 68, 68, 0.5);
            --text-normal: #f3f4f6;
            --text-muted: rgba(243, 244, 246, 0.55);
            --border: rgba(255, 255, 255, 0.08);
            --border-hover: rgba(239, 68, 68, 0.35);
            --border-accent: rgba(239, 68, 68, 0.6);
            --border-glass: rgba(255, 255, 255, 0.06);
            --success: #10b981;
            --danger: #ef4444;
            --radius: 16px;
            --radius-sm: 10px;
            --radius-lg: 24px;
            --glass-blur: 24px;
            --glass-border: 1px solid rgba(255, 255, 255, 0.08);
            --glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.08);
            --shadow: 0 8px 32px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(239, 68, 68, 0.15);
            --shadow-glow: 0 0 35px rgba(239, 68, 68, 0.18), 0 8px 32px rgba(0, 0, 0, 0.8);
            --font-main: 'Inter', system-ui, -apple-system, sans-serif;
            --transition: all 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.0);
            --transition-fast: all 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.0);
            --transition-spring: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #hub-loader-screen {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: var(--font-main);
            transition: opacity 0.8s ease;
            opacity: 1;
        }

        .loader-card {
            background: rgba(10, 10, 10, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(239, 68, 68, 0.25);
            border-top: 2px solid var(--accent);
            border-radius: 20px;
            padding: 40px 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.15);
            max-width: 420px;
            text-align: center;
        }

        .loader-spinner {
            width: 48px; height: 48px;
            border: 3px solid rgba(239, 68, 68, 0.15);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spinLoader 0.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
            margin-bottom: 24px;
            box-shadow: 0 0 24px var(--accent-glow);
        }

        @keyframes spinLoader {
            to { transform: rotate(360deg); }
        }

        .loader-text {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #ffffff;
            animation: pulseText 2s infinite ease-in-out;
        }

        @keyframes pulseText {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        /* Quest Skeletons */
        .skeleton-item {
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(8px);
            border: var(--glass-border);
            border-radius: var(--radius);
            padding: 14px;
            margin-bottom: 12px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .skeleton-header {
            display: flex;
            align-items: flex-start;
        }

        .skeleton-checkbox {
            width: 16px; height: 16px;
            background: rgba(239, 68, 68, 0.08);
            border: 1px solid var(--border);
            border-radius: 4px;
        }

        .skeleton-info {
            flex: 1;
            margin-left: 12px;
        }

        .skeleton-line {
            height: 12px;
            background: rgba(239, 68, 68, 0.08);
            border-radius: 6px;
            margin-bottom: 8px;
        }

        .skeleton-line.title { width: 60%; }

        .skeleton-details {
            display: flex;
            gap: 6px;
        }

        .skeleton-tag {
            width: 70px; height: 16px;
            background: rgba(239, 68, 68, 0.08);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
        }

        .skeleton-progress-track {
            background: rgba(239, 68, 68, 0.08);
            height: 4px;
            margin-top: 14px;
            width: 100%;
            border-radius: 4px;
        }

        .skeleton-item::after {
            content: '';
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: linear-gradient(
                90deg,
                rgba(239, 68, 68, 0) 0%,
                rgba(239, 68, 68, 0.05) 20%,
                rgba(239, 68, 68, 0.1) 50%,
                rgba(239, 68, 68, 0) 100%
            );
            transform: translateX(-100%);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }

        /* Main GUI Container */
        #discord-quests-gui {
            position: fixed;
            top: 50px; right: 50px;
            background: rgba(8, 8, 8, 0.88);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-top: 2px solid var(--accent);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-glow), var(--glass-highlight);
            z-index: 9999;
            width: 420px; height: 620px;
            color: var(--text-normal);
            font-family: var(--font-main);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            user-select: none;
            opacity: 0;
            pointer-events: none;
            transition: width 0.4s cubic-bezier(0.2, 0.9, 0.3, 1),
                        height 0.4s cubic-bezier(0.2, 0.9, 0.3, 1),
                        opacity 0.6s ease,
                        transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
        }

        #discord-quests-gui.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .gui-tabs, .tab-content, .controls-footer {
            transition: opacity 0.25s ease;
        }

        #discord-quests-gui.minimized {
            height: 56px;
            width: 260px;
            border-radius: var(--radius);
        }

        #discord-quests-gui.minimized .gui-tabs,
        #discord-quests-gui.minimized .tab-content,
        #discord-quests-gui.minimized .controls-footer {
            opacity: 0;
            pointer-events: none;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-12px) scale(0.96); filter: blur(4px); }
            to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        /* Header */
        .gui-header {
            padding: 14px 20px;
            background: rgba(14, 14, 14, 0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            height: 56px;
            box-sizing: border-box;
        }

        .gui-title {
            font-weight: 700;
            font-size: 15px;
            letter-spacing: 0.5px;
            color: var(--text-normal);
            display: flex;
            align-items: center;
            gap: 10px;
            text-transform: uppercase;
        }

        .gui-title svg {
            width: 18px; height: 18px;
            color: var(--accent);
            filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.5));
        }

        .gui-controls {
            display: flex;
            gap: 6px;
            align-items: center;
        }

        .control-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border);
            color: var(--text-muted);
            width: 30px; height: 30px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition-fast);
            backdrop-filter: blur(8px);
        }

        .control-btn:hover {
            border-color: var(--border-hover);
            color: var(--text-normal);
            background: rgba(255, 255, 255, 0.08);
            transform: scale(1.05);
        }

        .control-btn.close:hover {
            background: rgba(239, 68, 68, 0.25);
            border-color: rgba(239, 68, 68, 0.4);
            color: #ef4444;
        }

        .control-btn.github-btn:hover {
            color: var(--accent);
            border-color: var(--border-accent);
            background: var(--accent-soft);
        }

        .control-btn.lang-btn:hover {
            color: var(--accent);
            border-color: var(--border-accent);
            background: var(--accent-soft);
        }

        /* Tabs */
        .gui-tabs {
            display: flex;
            background: rgba(12, 12, 12, 0.5);
            border-bottom: 1px solid var(--border);
        }

        .tab-btn {
            flex: 1;
            padding: 12px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--text-muted);
            font-family: var(--font-main);
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: var(--transition-fast);
            text-align: center;
            position: relative;
        }

        .tab-btn:hover {
            color: var(--text-normal);
            background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
            color: var(--accent);
            border-bottom-color: var(--accent);
            background: var(--accent-soft);
            text-shadow: 0 0 12px rgba(239, 68, 68, 0.35);
        }

        /* Tab Content Panel */
        .tab-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .quests-container { padding: 20px; }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border);
        }

        .select-all-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-muted);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
        }

        .select-all-wrapper input {
            cursor: pointer;
            accent-color: var(--accent);
        }

        .refresh-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border);
            color: var(--text-muted);
            cursor: pointer;
            transition: var(--transition);
            padding: 7px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
        }

        .refresh-btn:hover {
            color: var(--accent);
            border-color: var(--border-accent);
            background: var(--accent-soft);
            transform: rotate(45deg);
        }

        /* Quest Items */
        .quest-item {
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid var(--border-glass);
            border-radius: var(--radius);
            padding: 14px;
            margin-bottom: 12px;
            position: relative;
            transition: var(--transition);
            cursor: pointer;
            box-shadow: var(--glass-highlight);
        }

        .quest-item:hover {
            border-color: var(--border-hover);
            background: rgba(26, 26, 26, 0.8);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), var(--glass-highlight);
        }

        .quest-item.selected {
            border-color: var(--border-accent);
            border-left: 3px solid var(--accent);
            background: rgba(239, 68, 68, 0.08);
            box-shadow: 0 0 24px rgba(239, 68, 68, 0.12), var(--glass-highlight);
        }

        .quest-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 10px;
        }

        .quest-checkbox {
            margin-top: 4px;
            width: 16px; height: 16px;
            accent-color: var(--accent);
            cursor: pointer;
        }

        .quest-info { flex: 1; }

        .quest-name {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-normal);
            margin-bottom: 6px;
        }

        .quest-details {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            font-size: 11px;
            color: var(--text-muted);
        }

        .quest-tag {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--border);
            padding: 3px 10px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            font-weight: 500;
        }

        .progress-track {
            background: rgba(239, 68, 68, 0.1);
            height: 4px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 12px;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--accent), #dc2626);
            width: 0%;
            border-radius: 4px;
            transition: width 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
        }

        /* Footer */
        .controls-footer {
            padding: 16px 20px;
            background: rgba(14, 14, 14, 0.6);
            backdrop-filter: blur(16px);
            border-top: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-sizing: border-box;
        }

        .actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            flex: 1;
            padding: 10px;
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            font-family: var(--font-main);
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: var(--text-normal);
            background: rgba(24, 24, 24, 0.6);
            backdrop-filter: blur(8px);
        }

        .btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #ef4444, #b91c1c);
            border: none;
            color: #fff;
            box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35);
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #f87171, #ef4444);
            box-shadow: 0 4px 22px rgba(239, 68, 68, 0.5);
            transform: translateY(-1px);
        }

        .btn-danger {
            border-color: rgba(239, 68, 68, 0.3);
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }

        .btn-danger:hover {
            background: rgba(239, 68, 68, 0.22);
            border-color: rgba(239, 68, 68, 0.45);
            box-shadow: 0 0 18px rgba(239, 68, 68, 0.2);
        }

        /* HypeSquad Panel */
        .hypesquad-houses {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .house-card {
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(14px);
            border: 1px solid var(--border-glass);
            border-radius: var(--radius);
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 14px;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: var(--glass-highlight);
        }

        .house-card:hover {
            border-color: var(--border-hover);
            background: rgba(26, 26, 26, 0.8);
            transform: translateY(-1px);
        }

        .house-card.selected {
            border-color: var(--border-accent);
            border-left: 3px solid var(--accent);
            background: rgba(239, 68, 68, 0.08);
            box-shadow: 0 0 24px rgba(239, 68, 68, 0.12), var(--glass-highlight);
        }

        .house-icon {
            font-size: 20px;
            width: 38px; height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--border);
            border-radius: 10px;
            transition: var(--transition-fast);
        }

        .house-card.selected .house-icon {
            border-color: var(--border-accent);
            background: var(--accent-soft);
            box-shadow: 0 0 14px rgba(239, 68, 68, 0.25);
        }

        .house-name {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-normal);
        }

        .house-desc {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 2px;
        }

        /* Notifications & Overlays */
        #notification-container {
            position: fixed;
            bottom: 20px; right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }

        .toast {
            background: rgba(12, 12, 12, 0.92);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-left: 3px solid var(--accent);
            padding: 16px;
            border-radius: var(--radius);
            box-shadow: var(--shadow-glow);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 400px;
            color: var(--text-normal);
            pointer-events: auto;
            animation: toastIn 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
            cursor: pointer;
        }

        .toast.success { border-left-color: var(--success); }
        .toast.error { border-left-color: var(--danger); }
        .toast.warning { border-left-color: #f59e0b; }

        @keyframes toastIn {
            from { opacity: 0; transform: translateX(20px) scale(0.95); filter: blur(4px); }
            to { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }

        .toast.leaving {
            animation: toastOut 0.3s forwards;
        }

        @keyframes toastOut {
            to { opacity: 0; transform: translateX(20px) scale(0.95); }
        }

        .confirm-overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(8, 8, 8, 0.75);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            border-radius: var(--radius-lg);
        }

        .confirm-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .confirm-modal {
            background: rgba(14, 14, 14, 0.95);
            backdrop-filter: blur(var(--glass-blur));
            padding: 24px;
            border-radius: var(--radius);
            border: 1px solid var(--border-hover);
            border-top: 2px solid var(--accent);
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
            box-shadow: var(--shadow-glow);
            max-width: 80%;
        }

        .confirm-overlay.active .confirm-modal {
            transform: scale(1);
        }

        .confirm-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--text-normal);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .confirm-text {
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 20px;
            line-height: 1.5;
        }

        .confirm-actions {
            display: flex;
            gap: 12px;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 5px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(239, 68, 68, 0.25);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(239, 68, 68, 0.45);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    
    const loaderScreen = document.createElement('div');
    loaderScreen.id = 'hub-loader-screen';
    loaderScreen.innerHTML = `
        <div class="loader-card">
            <div class="loader-spinner"></div>
            <div class="loader-text" id="loader-text">Loading Hub... 0%</div>
            <div style="margin-top: 24px; font-size: 12px; color: var(--danger); text-align: center; line-height: 1.5; font-weight: 500; opacity: 0.9; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
                ⚠️ AVISO: O uso deste script é por sua conta e risco. Não nos responsabilizamos por possíveis bans ou suspensões em sua conta do Discord.
            </div>
        </div>
    `;
    document.body.appendChild(loaderScreen);

    const gui = document.createElement('div');
    gui.id = 'discord-quests-gui';
    gui.innerHTML = `
        <div class="gui-header">
            <div class="gui-title">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                <span class="gui-title-text">${t('title')}</span>
            </div>
            <div class="gui-controls">
                <button class="control-btn lang-btn" title="Toggle Language" style="font-size: 10px; font-weight: 700; width: 48px; height: 28px; padding: 0;">PT-BR</button>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </a>
                <button class="control-btn minimize" title="Minimize">
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor"><rect width="12" height="2" rx="0"/></svg>
                </button>
                <button class="control-btn close" title="Close">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M9.5 2.5L2.5 9.5M2.5 2.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
            </div>
        </div>
        
        <div class="gui-tabs">
            <button class="tab-btn active" data-tab="quests" data-t="questsTab">${t('questsTab')}</button>
            <button class="tab-btn" data-tab="hypesquad" data-t="hypesquadTab">${t('hypesquadTab')}</button>
        </div>

        <div class="quests-container tab-content" id="tab-quests">
            <div class="toolbar">
                <label class="select-all-wrapper">
                    <input type="checkbox" id="select-all"> <span data-t="selectAll">${t('selectAll')}</span>
                </label>
                <button class="refresh-btn" title="Refresh">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
            </div>
            <div id="quests-list"></div>
        </div>

        <div class="hypesquad-container tab-content" id="tab-hypesquad" style="display: none; padding: 20px;">
            <div class="hypesquad-desc" data-t="hypesquadDesc" style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5;">
                ${t('hypesquadDesc')}
            </div>
            <div class="hypesquad-houses">
                <div class="house-card" data-house="1">
                    <div class="house-icon">🛡️</div>
                    <div class="house-details">
                        <div class="house-name" data-t="houseBravery">${t('houseBravery')}</div>
                        <div class="house-desc" data-t="houseBraveryDesc">${t('houseBraveryDesc')}</div>
                    </div>
                </div>
                <div class="house-card" data-house="2">
                    <div class="house-icon">💎</div>
                    <div class="house-details">
                        <div class="house-name" data-t="houseBrilliance">${t('houseBrilliance')}</div>
                        <div class="house-desc" data-t="houseBrillianceDesc">${t('houseBrillianceDesc')}</div>
                    </div>
                </div>
                <div class="house-card" data-house="3">
                    <div class="house-icon">⚖️</div>
                    <div class="house-details">
                        <div class="house-name" data-t="houseBalance">${t('houseBalance')}</div>
                        <div class="house-desc" data-t="houseBalanceDesc">${t('houseBalanceDesc')}</div>
                    </div>
                </div>
            </div>
            <div class="hypesquad-actions" style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-primary" id="hypesquad-add-btn" data-t="addBadge" disabled>${t('addBadge')}</button>
                <button class="btn btn-danger" id="hypesquad-remove-btn" data-t="removeBadge">${t('removeBadge')}</button>
            </div>
        </div>

        <div class="controls-footer">
            <div class="actions">
                <button class="btn btn-primary" id="start-btn" data-t="startSelected" disabled>${t('startSelected')}</button>
                <button class="btn btn-danger" id="stop-btn" data-t="stopAll" disabled>${t('stopAll')}</button>
            </div>
            <div style="text-align: center; font-size: 9px; color: var(--text-muted); margin-top: 4px; opacity: 0.3; letter-spacing: 1px;">BY LINUX-UR & DESTROYER</div>
        </div>

        <div class="confirm-overlay" id="confirm-overlay">
            <div class="confirm-modal">
                <div class="confirm-title" data-t="confirmTitle">${t('confirmTitle')}</div>
                <div class="confirm-text" data-t="confirmText">${t('confirmText')}</div>
                <div class="confirm-actions">
                    <button class="btn btn-danger" id="confirm-yes" data-t="confirmYes">${t('confirmYes')}</button>
                    <button class="btn btn-primary" id="confirm-no" data-t="confirmNo">${t('confirmNo')}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(gui);

    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);

    let activeQuests = new Map();

    const showNotification = (type, title, message, duration = 4000) => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div>
                <div style="font-weight: 700; margin-bottom: 2px">${title}</div>
                <div style="font-size: 12px; opacity: 0.9">${message}</div>
            </div>
        `;

        const removeToast = () => {
            if (toast.classList.contains('leaving')) return;
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 200);
        };

            toast.addEventListener('click', removeToast);
        notificationContainer.appendChild(toast);
        setTimeout(removeToast, duration);
    };

    // Language selection dialog
    const showLanguageSelectionDialog = () => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        overlay.style.backdropFilter = 'blur(10px)';
        overlay.style.webkitBackdropFilter = 'blur(10px)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '100001';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.style.backgroundColor = 'rgba(14, 14, 14, 0.95)';
        dialog.style.border = '1px solid var(--border-accent)';
        dialog.style.borderTop = '2px solid var(--accent)';
        dialog.style.padding = '24px';
        dialog.style.borderRadius = 'var(--radius)';
        dialog.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px var(--accent-glow)';
        dialog.style.width = '320px';
        dialog.style.textAlign = 'center';
        dialog.style.fontFamily = 'var(--font-main)';
        dialog.style.color = 'var(--text-normal)';
        dialog.innerHTML = `
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 16px;">
                Select Language / Selecione o Idioma
            </div>
            <div style="margin-bottom: 24px;">
                <button id="lang-en-btn" style="background: var(--accent); color: #ffffff; border: none; padding: 10px 20px; margin: 0 5px; cursor: pointer; border-radius: var(--radius-sm); font-weight: 600;">
                    English
                </button>
                <button id="lang-pt-btn" style="background: rgba(24, 24, 24, 0.8); color: var(--text-normal); border: 1px solid var(--border); padding: 10px 20px; margin: 0 5px; cursor: pointer; border-radius: var(--radius-sm); font-weight: 600;">
                    Português
                </button>
            </div>
            <div style="font-size: 12px; color: var(--text-muted);">
                This choice will be saved and remembered for future sessions.<br/>
                Esta escolha será salva e lembrada para sessões futuras.
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Add event listeners
        const enBtn = dialog.querySelector('#lang-en-btn');
        const ptBtn = dialog.querySelector('#lang-pt-btn');

        enBtn.addEventListener('click', () => {
            safeLocalStorage.setItem('discord-hub-language', 'en');
            currentLang = 'en';
            updateTranslations();
            overlay.remove();
        });

        ptBtn.addEventListener('click', () => {
            safeLocalStorage.setItem('discord-hub-language', 'pt');
            currentLang = 'pt';
            updateTranslations();
            overlay.remove();
        });

        // Clicking outside closes dialog (optional)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };

    const logMessage = (msg, type = 'info') => {
        const formattedMsg = `[DiscordHub] ${msg}`;
        if (type === 'error') console.error(formattedMsg);
        else if (type === 'success') console.log(`%c${formattedMsg}`, 'color: #10b981; font-weight: bold;');
        else console.log(formattedMsg);
    };

    const loadQuests = () => {
        const list = document.getElementById('quests-list');
        
        list.innerHTML = `
            <div class="skeleton-item">
                <div class="skeleton-header">
                    <div class="skeleton-checkbox"></div>
                    <div class="skeleton-info">
                        <div class="skeleton-line title"></div>
                        <div class="skeleton-details">
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                        </div>
                    </div>
                </div>
                <div class="skeleton-progress-track"></div>
            </div>
            <div class="skeleton-item">
                <div class="skeleton-header">
                    <div class="skeleton-checkbox"></div>
                    <div class="skeleton-info">
                        <div class="skeleton-line title"></div>
                        <div class="skeleton-details">
                            <div class="skeleton-tag"></div>
                            <div class="skeleton-tag"></div>
                        </div>
                    </div>
                </div>
                <div class="skeleton-progress-track"></div>
            </div>
        `;

        
        setTimeout(() => {
            try {
                if (!QuestsStore || !QuestsStore.quests) {
                    throw new Error(t('questsStoreError'));
                }

                const rawQuests = [...QuestsStore.quests.values()];
                console.log("[DiscordHub] Raw quests in store:", rawQuests);

                const allQuests = rawQuests.filter(q => {
                    if (!q) return false;
                    const hasEnrolled = !!q.userStatus?.enrolledAt;
                    const isCompleted = !!q.userStatus?.completedAt;
                    const expiresAtStr = q.config?.expiresAt;
                    const isExpired = expiresAtStr ? new Date(expiresAtStr).getTime() <= Date.now() : true;
                    const taskConfig = q.config?.taskConfig ?? q.config?.taskConfigV2;
                    const tasksObj = taskConfig?.tasks;
                    const hasSupportedTask = tasksObj ? supportedTasks.some(t => tasksObj[t] != null) : false;
                    
                    const matches = hasEnrolled && !isCompleted && !isExpired && hasSupportedTask;
                    console.log(`[DiscordHub] Quest "${q.config?.messages?.questName || q.id}": enrolled=${hasEnrolled}, completed=${isCompleted}, expired=${isExpired}, tasks=${!!tasksObj}, supportedTask=${hasSupportedTask} => eligible=${matches}`);
                    return matches;
                });

                console.log("[DiscordHub] Filtered eligible quests:", allQuests);

                if (allQuests.length === 0) {
                    list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding: 20px;">${t('noQuests')}</div>`;
                    return;
                }

                list.innerHTML = '';
                allQuests.forEach(quest => {
                    const config = quest.config.taskConfig ?? quest.config.taskConfigV2;
                    const taskName = supportedTasks.find(t => config.tasks[t] != null);
                    if (!taskName) return;

                    const target = config.tasks[taskName].target;
                    let current = quest.userStatus?.progress?.[taskName]?.value ?? 0;
                    if (quest.config.configVersion === 1 && (taskName === "STREAM_ON_DESKTOP" || taskName === "PLAY_ON_DESKTOP")) {
                        current = quest.userStatus?.streamProgressSeconds ?? 0;
                    }

                    const percent = Math.min(100, Math.round((current / target) * 100));

                    const item = document.createElement('div');
                    item.className = 'quest-item';
                    item.innerHTML = `
                        <div class="quest-header">
                            <input type="checkbox" class="quest-checkbox" data-id="${quest.id}">
                            <div class="quest-info">
                                <div class="quest-name">${quest.config.messages.questName}</div>
                                <div class="quest-details">
                                    <span class="quest-tag">🎮 ${quest.config.application?.name ?? quest.config.messages?.questName ?? "Discord"}</span>
                                    <span class="quest-tag">📌 ${taskName.replace(/_/g, ' ')}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:8px;">
                            <span>${t('progressLabel')}</span>
                            <span class="progress-text">${Math.floor(current)} / ${target}s (${percent}%)</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-bar" style="width: ${percent}%"></div>
                        </div>
                    `;

                    item.addEventListener('click', (e) => {
                        if (e.target.type !== 'checkbox') {
                            const cb = item.querySelector('.quest-checkbox');
                            cb.checked = !cb.checked;
                            cb.dispatchEvent(new Event('change'));
                        }
                    });

                    item.querySelector('.quest-checkbox').addEventListener('change', (e) => {
                        item.classList.toggle('selected', e.target.checked);
                        updateButtons();
                    });

                    list.appendChild(item);
                });
                showNotification('success', t('readyNotification'), t('loadedNotification', allQuests.length));
            } catch (e) {
                list.innerHTML = `<div style="text-align:center; color:var(--danger);">${t('questsErrorLog')}: ${e.message}</div>`;
                console.error("[DiscordHub] Error loading quests:", e);
            }
        }, 4000); 
    };

    const updateButtons = () => {
        const hasChecked = document.querySelectorAll('.quest-checkbox:checked').length > 0;
        document.getElementById('start-btn').disabled = !hasChecked || activeQuests.size > 0;
    };

    const startQuests = async () => {
        const checked = document.querySelectorAll('.quest-checkbox:checked');
        if (checked.length === 0) return;

        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        const toStart = [];
        checked.forEach(cb => {
            const q = [...QuestsStore.quests.values()].find(x => x.id === cb.dataset.id);
            if (q) toStart.push(q);
        });

        logMessage(t('startedLogs', toStart.length), 'info');
        showNotification('info', t('startedNotificationTitle'), t('startedNotificationDesc'));

        activeQuests.delete('STOPPED');

        for (const quest of toStart) {
            if (activeQuests.has('STOPPED')) break;

            const checkboxEl = document.querySelector(`.quest-checkbox[data-id="${quest.id}"]`);
            if (!checkboxEl) continue;
            
            const item = checkboxEl.closest('.quest-item');
            item.style.opacity = '0.7';
            item.style.pointerEvents = 'none';
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });

            try {
                logMessage(t('runningQuestLog', quest.config.messages.questName), 'info');
                await runQuest(quest);

                logMessage(t('completedQuestLog', quest.config.messages.questName), 'success');
                showNotification('success', t('completedNotificationTitle'), t('completedNotificationDesc', quest.config.messages.questName));

                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
                item.classList.remove('selected');
                checkboxEl.checked = false;
            } catch (e) {
                logMessage(t('failedQuestLog', quest.config.messages.questName, e.message), 'error');
                showNotification('error', t('failedNotificationTitle'), `${quest.config.messages.questName}: ${e.message}`);
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            }

            await new Promise(r => setTimeout(r, 2000));
        }

        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateButtons();
    };

    const stopQuests = () => {
        activeQuests.set('STOPPED', true);
        activeQuests.forEach((c, key) => {
            if (key === 'STOPPED') return;
            if (c.interval) clearInterval(c.interval);
            if (c.unsubscribe) c.unsubscribe();
            if (c.cleanup) c.cleanup();
            c.abort.abort();
        });
        activeQuests.clear();
        logMessage(t('interruptedLog'), 'error');
        showNotification('warning', t('interruptedNotificationTitle'), t('interruptedNotificationDesc'));
        
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateButtons();
    };

    const runQuest = (quest) => {
        return new Promise(async (resolve, reject) => {
            if (activeQuests.has(quest.id)) return resolve();

            const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
            const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
            const target = taskConfig.tasks[taskName].target;

            let current = quest.userStatus?.progress?.[taskName]?.value ?? 0;
            if (quest.config.configVersion === 1 && (taskName === "STREAM_ON_DESKTOP" || taskName === "PLAY_ON_DESKTOP")) {
                current = quest.userStatus?.streamProgressSeconds ?? 0;
            }

            const controller = new AbortController();
            const state = {
                abort: controller,
                interval: null,
                unsubscribe: null,
                cleanup: null
            };
            activeQuests.set(quest.id, state);

            controller.signal.addEventListener('abort', () => {
                reject(new Error(t('abortedByUser')));
            });

            try {
                if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                    await simulateVideo(quest, target, current, state, resolve);
                } else if (taskName === "PLAY_ON_DESKTOP") {
                    await simulatePlay(quest, target, current, state, resolve);
                } else if (taskName === "STREAM_ON_DESKTOP") {
                    await simulateStream(quest, target, current, state, resolve);
                } else if (taskName === "PLAY_ACTIVITY") {
                    await simulateActivity(quest, target, current, state, resolve);
                } else {
                    reject(new Error(t('unknownTask')));
                }
            } catch (e) {
                reject(e);
            } finally {
                if (state.cleanup) state.cleanup();
                if (state.unsubscribe) state.unsubscribe();
                activeQuests.delete(quest.id);
            }
        });
    };

    const updateUIProgress = (questId, current, total) => {
        const item = document.querySelector(`.quest-checkbox[data-id="${questId}"]`)?.closest('.quest-item');
        if (!item) return;
        const pct = Math.min(100, Math.round((current / total) * 100));
        item.querySelector('.progress-bar').style.width = `${pct}%`;
        item.querySelector('.progress-text').textContent = `${Math.floor(current)} / ${total}s (${pct}%)`;
    };

    const simulateVideo = async (quest, target, current, state, resolve) => {
        const speed = 7;
        let completed = false;

        logMessage(t('videoStealthLogs'), 'info');

        while (current < target) {
            if (state.abort.signal.aborted) return;

            const remaining = Math.min(speed, target - current);
            await new Promise(r => setTimeout(r, (remaining * 1000) + (Math.random() * 500)));

            if (state.abort.signal.aborted) return;

            const timestamp = current + speed;
            try {
                const res = await api.post({
                    url: `/quests/${quest.id}/video-progress`,
                    body: { timestamp: Math.min(target, timestamp + Math.random()) }
                });
                completed = res.body.completed_at != null;
                current = Math.min(target, timestamp);
                updateUIProgress(quest.id, current, target);
                logMessage(t('videoProgressLog', Math.floor(current), target), 'info');
            } catch (e) {
                logMessage(t('requestErrorLog', e.message), 'error');
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        if (!completed && !state.abort.signal.aborted) {
            try {
                await api.post({
                    url: `/quests/${quest.id}/video-progress`,
                    body: { timestamp: target }
                });
                updateUIProgress(quest.id, target, target);
            } catch (e) {}
        }
        resolve();
    };

    const simulatePlay = (quest, target, current, state, resolve) => {
        const pid = Math.floor(Math.random() * 30000) + 1000;
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
        const taskData = taskConfig.tasks[taskName];
        const applicationId = quest.config.application?.id ?? taskData?.applications?.[0]?.id;
        const applicationName = quest.config.application?.name ?? quest.config.messages?.questName ?? "Game";

        if (!isApp) {
            logMessage(t('browserWarning'), 'error');
        }

        api.get({ url: `/applications/public?application_ids=${applicationId}` }).then(res => {
            const appData = res.body[0];
            if (!appData) {
                throw new Error(t('appDataNotFound'));
            }
            const exeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">", "") ?? appData.name.replace(/[\/\\:*?"<>|]/g, "");

            const fakeGame = {
                cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                exeName,
                exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                hidden: false,
                isLauncher: false,
                id: applicationId,
                name: appData.name,
                pid: pid,
                pidPath: [pid],
                processName: appData.name,
                start: Date.now(),
            };

            const realGames = RunningGameStore.getRunningGames();
            const realGetRunningGames = RunningGameStore.getRunningGames;
            const realGetGameForPID = RunningGameStore.getGameForPID;

            const fakeGames = [fakeGame];

            RunningGameStore.getRunningGames = () => fakeGames;
            RunningGameStore.getGameForPID = (pid) => fakeGames.find(x => x.pid === pid);

            FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames });

            state.cleanup = () => {
                RunningGameStore.getRunningGames = realGetRunningGames;
                RunningGameStore.getGameForPID = realGetGameForPID;
                FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: [] });
            };

            const fn = (data) => {
                if (state.abort.signal.aborted) return;
                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                updateUIProgress(quest.id, progress, target);
                logMessage(t('playProgressLog', progress, target), 'info');

                if (progress >= target) {
                    resolve();
                }
            };

            state.unsubscribe = () => FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);

            logMessage(t('playSpoofing', applicationName), 'info');
        }).catch(e => {
            logMessage(t('fetchingAppError') + e.message, 'error');
            state.abort.abort();
        });
    };

    const simulateStream = (quest, target, current, state, resolve) => {
        const pid = Math.floor(Math.random() * 30000) + 1000;
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
        const taskData = taskConfig.tasks[taskName];
        const applicationId = quest.config.application?.id ?? taskData?.applications?.[0]?.id;
        const applicationName = quest.config.application?.name ?? quest.config.messages?.questName ?? "Stream";

        if (!isApp) {
            logMessage(t('browserWarning'), 'error');
        }

        let realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
            id: applicationId,
            pid,
            sourceName: null
        });

        state.cleanup = () => {
            ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
        };

        const fn = (data) => {
            if (state.abort.signal.aborted) return;
            let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
            updateUIProgress(quest.id, progress, target);
            logMessage(t('streamProgressLog', progress, target), 'info');

            if (progress >= target) {
                resolve();
            }
        };

        state.unsubscribe = () => FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);

        logMessage(t('streamJoinVC', applicationName), 'info');
    };

    const simulateActivity = async (quest, target, current, state, resolve) => {
        let channelId = ChannelStore.getSortedPrivateChannels()[0]?.id;
        if (!channelId) {
            const guildWithVocal = Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL && x.VOCAL.length > 0);
            channelId = guildWithVocal?.VOCAL[0]?.channel?.id;
        }

        if (!channelId) {
            throw new Error(t('noChannel'));
        }

        const streamKey = `call:${channelId}:1`;
        logMessage(t('activitySpoofing', channelId), 'info');

        while (current < target) {
            if (state.abort.signal.aborted) return;

            try {
                const res = await api.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: false } });
                current = res.body.progress.PLAY_ACTIVITY.value;
                updateUIProgress(quest.id, current, target);
                logMessage(t('activityProgressLog', Math.floor(current), target), 'info');

                if (current >= target) break;

                await new Promise(r => setTimeout(r, 20000 + (Math.random() * 2000)));
            } catch (e) {
                logMessage(t('activityHeartbeatError', e.message), 'error');
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        if (!state.abort.signal.aborted) {
            try {
                await api.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: true } });
            } catch (e) {}
        }
        resolve();
    };

    const addHypeSquad = async (houseId) => {
        const postFn = api.post.bind(api);
        return postFn({ url: "/hypesquad/online", body: { house_id: parseInt(houseId) } });
    };

    const removeHypeSquad = async () => {
        const delFn = (api.del || api.delete).bind(api);
        return delFn({ url: "/hypesquad/online" });
    };

    const handleAddHypeSquad = async (houseId) => {
        logMessage(t('hypesquadJoining', houseId), 'info');
        try {
            await addHypeSquad(houseId);
            logMessage(t('hypesquadSuccess', houseId), 'success');
            showNotification('success', 'HypeSquad', t('hypesquadAddToast'));
        } catch (e) {
            logMessage(t('hypesquadAddError', e.message), 'error');
            showNotification('error', 'HypeSquad', `${t('errorLabel')}: ${e.message}`);
        }
    };

    const handleRemoveHypeSquad = async () => {
        logMessage(t('hypesquadRemoving'), 'info');
        try {
            await removeHypeSquad();
            logMessage(t('hypesquadRemoveSuccess'), 'success');
            showNotification('success', 'HypeSquad', t('hypesquadRemoveToast'));
        } catch (e) {
            logMessage(t('hypesquadRemoveError', e.message), 'error');
            showNotification('error', 'HypeSquad', `${t('errorLabel')}: ${e.message}`);
        }
    };

    
    const updateTranslations = () => {
        const langBtn = gui.querySelector('.lang-btn');
        if (langBtn) langBtn.textContent = currentLang === 'en' ? 'PT-BR' : 'EN';

        gui.querySelectorAll('[data-t]').forEach(el => {
            const key = el.dataset.t;
            el.textContent = t(key);
        });

        const titleText = gui.querySelector('.gui-title-text');
        if (titleText) titleText.textContent = t('title');

        loadQuests();
    };

    
    gui.querySelector('.lang-btn').addEventListener('click', (e) => {
        e.preventDefault();
        currentLang = currentLang === 'en' ? 'pt' : 'en';
        updateTranslations();
    });

    
    const tabButtons = gui.querySelectorAll('.tab-btn');
    const tabContents = gui.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            tabButtons.forEach(b => b.classList.toggle('active', b === btn));
            tabContents.forEach(c => {
                const targetId = `tab-${tabName}`;
                if (c.id === targetId) {
                    c.style.display = 'flex';
                } else {
                    c.style.display = 'none';
                }
            });

            
            const footerActions = gui.querySelector('.controls-footer .actions');
            if (footerActions) {
                footerActions.style.display = tabName === 'quests' ? 'flex' : 'none';
            }
        });
    });

    
    const houseCards = gui.querySelectorAll('.house-card');
    const hsAddBtn = gui.querySelector('#hypesquad-add-btn');
    const hsRemoveBtn = gui.querySelector('#hypesquad-remove-btn');
    let selectedHouseId = null;

    houseCards.forEach(card => {
        card.addEventListener('click', () => {
            const houseId = card.dataset.house;
            houseCards.forEach(c => c.classList.toggle('selected', c === card));
            selectedHouseId = houseId;
            hsAddBtn.disabled = false;
        });
    });

    hsAddBtn.addEventListener('click', () => {
        if (selectedHouseId) {
            handleAddHypeSquad(selectedHouseId);
        }
    });

    hsRemoveBtn.addEventListener('click', () => {
        handleRemoveHypeSquad();
    });

    
    let isDragging = false, startX, startY, initialLeft, initialTop;
    const header = gui.querySelector('.gui-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = gui.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        header.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        gui.style.top = `${initialTop + dy}px`;
        gui.style.left = `${initialLeft + dx}px`;
        gui.style.right = 'auto';
        gui.style.bottom = 'auto';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'move';
    });

    
    const overlay = gui.querySelector('#confirm-overlay');
    gui.querySelector('.close').addEventListener('click', () => {
        overlay.classList.add('active');
    });

    gui.querySelector('#confirm-yes').addEventListener('click', () => {
        gui.remove();
        notificationContainer.remove();
    });

    gui.querySelector('#confirm-no').addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    gui.querySelector('.minimize').addEventListener('click', () => gui.classList.toggle('minimized'));
    
    gui.querySelector('.refresh-btn').addEventListener('click', (e) => {
        e.preventDefault();
        loadQuests();
    });
    
    gui.querySelector('#select-all').addEventListener('change', (e) => {
        document.querySelectorAll('.quest-checkbox').forEach(c => {
            c.checked = e.target.checked;
            c.dispatchEvent(new Event('change'));
        });
    });

    gui.querySelector('#start-btn').addEventListener('click', startQuests);
    gui.querySelector('#stop-btn').addEventListener('click', stopQuests);

    const loaderTextEl = document.getElementById('loader-text');
    let loadProgress = 0;
    const fakeLoadInterval = setInterval(() => {
        if (loadProgress < 85) {
            loadProgress += Math.floor(Math.random() * 5) + 1;
            if (loadProgress > 85) loadProgress = 85;
        }
        if (loaderTextEl) {
            loaderTextEl.textContent = `Loading Hub... ${loadProgress}%`;
        }
    }, 60);

    setTimeout(() => {
        clearInterval(fakeLoadInterval);
        if (loaderTextEl) {
            loaderTextEl.textContent = `Loading Hub... 100%`;
        }
        
        setTimeout(() => {
            loaderScreen.style.opacity = '0';
            setTimeout(() => {
                loaderScreen.remove();
                gui.classList.add('visible');

                // Language selection delay
                const checkLanguageAndStart = () => {
                    const savedLang = safeLocalStorage.getItem('discord-hub-language');
                    if (savedLang) {
                        currentLang = savedLang;
                        updateTranslations();
                    } else {
                        // Show language selection dialog after 800ms delay
                        setTimeout(showLanguageSelectionDialog, 800);
                    }
                };

                checkLanguageAndStart();

            }, 500);
        }, 600);
    }, 2800); 

    loadQuests();
};
createGUI();
})();
