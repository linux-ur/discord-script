
delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();


let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.Z;
let RunningGameStore, QuestsStore, ChannelStore, GuildChannelStore, FluxDispatcher, api
if(!ApplicationStreamingStore) {
	ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata).exports.A;
	RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames).exports.Ay;
	QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest).exports.A;
	ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent).exports.A;
	GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getSFWDefaultChannel).exports.Ay;
	FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.h?.__proto__?.flushWaitQueue).exports.h;
	api = Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get).exports.Bo;
} else {
	RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getRunningGames).exports.ZP;
	QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getQuest).exports.Z;
	ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getAllThreadsForParent).exports.Z;
	GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getSFWDefaultChannel).exports.ZP;
	FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue).exports.Z;
	api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get).exports.tn;	
}if (!QuestsStore || !api) {
	throw new Error("Required modules not found");
}

const createGUI = () => {
    const existingGUI = document.getElementById('discord-quests-gui');
    if (existingGUI) existingGUI.remove();
    const existingNotificationContainer = document.getElementById('notification-container');
    if (existingNotificationContainer) existingNotificationContainer.remove();

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
            --bg-primary: #000000;
            --bg-secondary: #0a0a0a;
            --bg-tertiary: #1a1a1a;
            --accent: #5865F2;
            --accent-hover: #4752C4;
            --text-normal: #ffffff;
            --text-muted: #b9bbbe;
            --border: #333333;
            --success: #23a559;
            --danger: #da373c;
            --radius: 12px;
            --shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
            --font-main: 'Inter', system-ui, sans-serif;
            --transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        #discord-quests-gui {
            position: fixed;
            top: 50px;
            right: 50px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            z-index: 9999;
            width: 420px;
            max-height: 800px; /* Explicit max-height for transition */
            color: var(--text-normal);
            font-family: var(--font-main);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            user-select: none;
            transition: var(--transition); /* Ensure transition is applied */
        }

        #discord-quests-gui.minimized {
            max-height: 60px; /* Collapsed height */
            /* Remove explicit height to allow transition */
            width: 250px;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .gui-header {
            padding: 16px 20px;
            background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }

        .gui-title {
            font-weight: 700;
            font-size: 16px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .gui-title svg {
            width: 20px;
            height: 20px;
            color: var(--accent);
        }

        .gui-controls {
            display: flex;
            gap: 8px;
        }

        .control-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: var(--text-muted);
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }

        .control-btn:hover {
            background: rgba(255,255,255,0.2);
            color: #fff;
        }

        .control-btn.close:hover {
            background: var(--danger);
        }

        .quests-container {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        #discord-quests-gui.minimized .quests-container,
        #discord-quests-gui.minimized .controls-footer {
            display: none;
        }

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
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            transition: var(--transition);
            padding: 4px;
            border-radius: 4px;
        }

        .refresh-btn:hover {
            color: #fff;
            background: rgba(255,255,255,0.1);
            transform: rotate(180deg);
        }

        .quest-item {
            background: var(--bg-secondary);
            border: 1px solid rgba(0,0,0,0);
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 12px;
            position: relative;
            transition: var(--transition);
            cursor: pointer;
        }

        .quest-item:hover {
            background: rgba(43, 45, 49, 0.9);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .quest-item.selected {
            border-color: var(--accent);
            background: rgba(88, 101, 242, 0.1);
        }

        .quest-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 10px;
        }

        .quest-checkbox {
            margin-top: 4px;
            width: 16px;
            height: 16px;
            accent-color: var(--accent);
            cursor: pointer;
        }

        .quest-info {
            flex: 1;
        }

        .quest-name {
            font-weight: 600;
            font-size: 14px;
            color: #fff;
            margin-bottom: 4px;
        }

        .quest-details {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 12px;
            color: var(--text-muted);
        }

        .quest-tag {
            background: var(--bg-tertiary);
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .progress-track {
            background: var(--bg-tertiary);
            height: 6px;
            border-radius: 3px;
            overflow: hidden;
            margin-top: 12px;
        }

        .progress-bar {
            height: 100%;
            background: var(--accent);
            width: 0%;
            border-radius: 3px;
            transition: width 0.5s ease;
            box-shadow: 0 0 10px rgba(88, 101, 242, 0.5);
        }

        .controls-footer {
            padding: 20px;
            background: rgba(30, 31, 34, 0.95);
            border-top: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .log-container {
            height: 120px;
            background: #111;
            border-radius: 8px;
            padding: 10px;
            font-family: 'Consolas', monospace;
            font-size: 11px;
            overflow-y: auto;
            color: var(--text-muted);
            border: 1px solid var(--border);
        }

        .log-entry {
            margin-bottom: 4px;
            line-height: 1.4;
            display: flex;
        }

        .log-time {
            color: #666;
            margin-right: 8px;
            min-width: 50px;
        }

        .actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #fff;
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }

        .btn-primary {
            background: var(--accent);
        }

        .btn-primary:hover {
            background: var(--accent-hover);
        }

        .btn-danger {
            background: var(--danger);
        }

        .btn-danger:hover {
            background: #b92d32;
        }

        #notification-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }

        .toast {
            background: #000000;
            border: 1px solid var(--border);
            border-left: 4px solid var(--accent);
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 400px;
            color: #fff;
            pointer-events: auto;
            animation: toastIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            margin-top: 10px; /* Ensure spacing */
            cursor: pointer; /* Require interaction hint */
        }

        .toast.success { border-color: var(--success); }
        .toast.error { border-color: var(--danger); }
        .toast.warning { border-color: #f0b232; }

        @keyframes toastIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes toastOut {
            to { opacity: 0; transform: translateX(50px); }
        }

        .toast.leaving {
            animation: toastOut 0.3s forwards;
        }
        
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
        }

        .confirm-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .confirm-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .confirm-modal {
            background: var(--bg-primary);
            padding: 24px;
            border-radius: 12px;
            border: 1px solid var(--border);
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 12px 32px rgba(0,0,0,0.5);
            max-width: 80%;
        }

        .confirm-overlay.active .confirm-modal {
            transform: scale(1);
        }

        .confirm-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #fff;
        }

        .confirm-text {
            font-size: 14px;
            color: var(--text-muted);
            margin-bottom: 20px;
            line-height: 1.4;
        }

        .confirm-actions {
            display: flex;
            gap: 12px;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    const gui = document.createElement('div');
    gui.id = 'discord-quests-gui';
    gui.innerHTML = `
        <div class="gui-header">
            <div class="gui-title">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                Quest Manager
            </div>
            <div class="gui-controls">
                <button class="control-btn minimize" title="Minimize">
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor"><rect width="12" height="2" rx="1"/></svg>
                </button>
                <button class="control-btn close" title="Close">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M9.5 2.5L2.5 9.5M2.5 2.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
            </div>
        </div>
        <div class="quests-container">
            <div class="toolbar">
                <label class="select-all-wrapper">
                    <input type="checkbox" id="select-all"> Select All
                </label>
                <button class="refresh-btn" title="Refresh">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
            </div>
            <div id="quests-list"></div>
        </div>
        <div class="controls-footer">
            <div class="log-container" id="status-log"></div>
            <div class="actions">
                <button class="btn btn-primary" id="start-btn" disabled>Start Selected</button>
                <button class="btn btn-danger" id="stop-btn" disabled>Stop All</button>
            </div>
            <div style="text-align: center; font-size: 10px; color: var(--text-muted); margin-top: 12px; opacity: 0.4; letter-spacing: 0.5px;">by destroyer</div>
        </div>
        <div class="confirm-overlay" id="confirm-overlay">
            <div class="confirm-modal">
                <div class="confirm-title">Tem certeza?</div>
                <div class="confirm-text">Se fechar, voc&ecirc; ter&aacute; que executar o script novamente!</div>
                <div class="confirm-actions">
                    <button class="btn btn-danger" id="confirm-yes">SIM</button>
                    <button class="btn btn-primary" id="confirm-no">N&Atilde;O</button>
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
                <div style="font-size: 13px; opacity: 0.9">${message}</div>
            </div>
        `;

        const removeToast = () => {
            if (toast.classList.contains('leaving')) return;
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 300); // Wait for animation
        };

        toast.addEventListener('click', removeToast);

        notificationContainer.appendChild(toast);

        setTimeout(removeToast, duration);
    };

    const logMessage = (msg, type = 'info') => {
        const log = document.getElementById('status-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = new Date().toLocaleTimeString([], { hour12: false });
        entry.innerHTML = `<span class="log-time">[${time}]</span><span style="color: ${type === 'error' ? '#da373c' : type === 'success' ? '#23a559' : '#dbdee1'}">${msg}</span>`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    };

    const loadQuests = () => {
        const list = document.getElementById('quests-list');
        list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding: 20px;">Fetching quests...</div>`;
        try {
            const allQuests = [...QuestsStore.quests.values()].filter(q =>
                q.id !== "1412491570820812933" &&
                q.userStatus?.enrolledAt &&
                !q.userStatus?.completedAt &&
                new Date(q.config.expiresAt).getTime() > Date.now()
            );

            if (allQuests.length === 0) {
                list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding: 20px;">No active quests found.</div>`;
                return;
            }

            list.innerHTML = '';
            allQuests.forEach(quest => {
                const config = quest.config.taskConfig ?? quest.config.taskConfigV2;
                const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(t => config.tasks[t] != null);
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
                                <span class="quest-tag">🎮 ${quest.config.application.name}</span>
                                <span class="quest-tag">📌 ${taskName.replace(/_/g, ' ')}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:8px;">
                        <span>Progress</span>
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
            showNotification('success', 'Ready', `Loaded ${allQuests.length} available quests.`);
        } catch (e) {
            list.innerHTML = `<div style="text-align:center; color:var(--danger);">Error: ${e.message}</div>`;
            logMessage(e.message, 'error');
        }
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

        logMessage(`Starting ${toStart.length} quests...`, 'info');
        showNotification('info', 'Started Quests', `Queued ${toStart.length} quests for execution.`);

        // Execute sequentially to prevent Store conflict issues
        for (const quest of toStart) {
            if (activeQuests.has('STOPPED')) break; // Check global stop signal

            const item = document.querySelector(`.quest-checkbox[data-id="${quest.id}"]`).closest('.quest-item');
            item.style.opacity = '0.7';
            item.style.pointerEvents = 'none';
            // Scroll to item
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });

            try {
                logMessage(`Running quest: ${quest.config.messages.questName}...`, 'info');
                await runQuest(quest);

                logMessage(`Quest ${quest.config.messages.questName} COMPLETED`, 'success');
                showNotification('success', 'Quest Finished', `Finished ${quest.config.messages.questName}`);

                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
                item.classList.remove('selected');
                item.querySelector('.quest-checkbox').checked = false;
                // Update progress bar to full green? It should be handled by updateUI
            } catch (e) {
                logMessage(`Quest ${quest.config.messages.questName} failed/stopped: ${e.message}`, 'error');
                showNotification('error', 'Quest Failed', `${quest.config.messages.questName}: ${e.message}`);
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            }

            // Small delay between quests
            await new Promise(r => setTimeout(r, 1000));
        }

        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateButtons();
    };

    const stopQuests = () => {
        activeQuests.set('STOPPED', true); // Signal to stop the loop
        activeQuests.forEach((c, key) => {
            if (key === 'STOPPED') return;
            if (c.interval) clearInterval(c.interval);
            if (c.unsubscribe) c.unsubscribe(); // Unsubscribe flux
            if (c.cleanup) c.cleanup(); // Restore stores
            c.abort.abort();
        });
        activeQuests.clear();
        logMessage('Stopping all quests...', 'error');
        showNotification('warning', 'Stopping', 'All quests execution stopped.');
    };

    const runQuest = (quest) => {
        return new Promise(async (resolve, reject) => {
            if (activeQuests.has(quest.id)) return resolve();

            const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
            const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks[x] != null);
            const target = taskConfig.tasks[taskName].target;

            // Get current progress
            let current = 0;
            if (quest.userStatus?.progress?.[taskName]) current = quest.userStatus.progress[taskName].value;
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
                reject(new Error("Aborted by user"));
            });

            try {
                if (taskName.includes("WATCH_VIDEO")) {
                    await simulateVideo(quest, target, current, state, resolve);
                } else if (taskName === "PLAY_ON_DESKTOP") {
                    await simulatePlay(quest, target, current, state, resolve);
                } else if (taskName === "STREAM_ON_DESKTOP") {
                    await simulateStream(quest, target, current, state, resolve);
                } else if (taskName === "PLAY_ACTIVITY") {
                    await simulateActivity(quest, target, current, state, resolve);
                } else {
                    reject(new Error("Unknown task type"));
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
        const enrolled = new Date(quest.userStatus.enrolledAt).getTime();
        const maxFuture = 10, speed = 7, interval = 1; // From user snippet

        while (current < target) {
            if (state.abort.signal.aborted) return;

            const maxAllowed = Math.floor((Date.now() - enrolled) / 1000) + maxFuture;
            const diff = maxAllowed - current;
            const timestamp = current + speed;

            if (diff >= speed) {
                try {
                    await api.post({
                        url: `/quests/${quest.id}/video-progress`,
                        body: { timestamp: Math.min(target, timestamp + Math.random()) }
                    });
                    current = Math.min(target, timestamp);
                    updateUIProgress(quest.id, current, target);
                } catch (e) {
                    console.error(e); // Keep going even if error
                }
            }

            await new Promise(r => setTimeout(r, interval * 1000));
        }

        // Final completion
        try {
            await api.post({ url: `/quests/${quest.id}/video-progress`, body: { timestamp: target } });
            updateUIProgress(quest.id, target, target);
        } catch (e) { }
        resolve();
    };


    /* 
     * REAL SPOOFING LOGIC FOR PLAY/STREAM
     * Adapted from user provided code
     */

    const simulatePlay = (quest, target, current, state, resolve) => {
        const pid = Math.floor(Math.random() * 30000) + 1000;
        const applicationId = quest.config.application.id;
        const applicationName = quest.config.application.name;

        api.get({ url: `/applications/public?application_ids=${applicationId}` }).then(res => {
            const appData = res.body[0];
            const exeName = appData.executables.find(x => x.os === "win32").name.replace(">", "");

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

            // Override
            RunningGameStore.getRunningGames = () => [fakeGame];
            RunningGameStore.getGameForPID = (pid) => [fakeGame].find(x => x.pid === pid);

            // Dispatch change
            FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: [fakeGame] });

            // Cleanup function restore original state
            state.cleanup = () => {
                RunningGameStore.getRunningGames = realGetRunningGames;
                RunningGameStore.getGameForPID = realGetGameForPID;
                FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: [] });
            };

            const fn = (data) => {
                if (state.abort.signal.aborted) return;
                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                updateUIProgress(quest.id, progress, target);

                if (progress >= target) {
                    resolve();
                }
            };

            state.unsubscribe = () => FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);

            logMessage(`Spoofing game ${applicationName}. Wait...`, 'info');
        }).catch(e => {
            // Fallback if API fails? Or just use visual sim?
            // User wants real logic. If API fails, we can't get exeName.
            logMessage(`Failed to get app data: ${e.message}`, 'error');
            state.abort.abort();
        });
    };

    const simulateStream = (quest, target, current, state, resolve) => {
        const pid = Math.floor(Math.random() * 30000) + 1000;
        const applicationId = quest.config.application.id;
        const applicationName = quest.config.application.name;

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

            if (progress >= target) {
                resolve();
            }
        };

        state.unsubscribe = () => FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);

        logMessage(`Spoofing stream ${applicationName}. Join a VC with a friend!`, 'info');
    };

    const simulateActivity = async (quest, target, current, state, resolve) => {
        const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL.length > 0).VOCAL[0].channel.id;
        const streamKey = `call:${channelId}:1`;

        logMessage(`Activity spoofing in channel ${channelId}`, 'info');

        while (current < target) {
            if (state.abort.signal.aborted) return;

            try {
                const res = await api.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: false } });
                current = res.body.progress.PLAY_ACTIVITY.value;
                updateUIProgress(quest.id, current, target);

                await new Promise(r => setTimeout(r, 20 * 1000));
            } catch (e) {
                // Ignore errors
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        await api.post({ url: `/quests/${quest.id}/heartbeat`, body: { stream_key: streamKey, terminal: true } });
        resolve();
    };

    // Initial Drag Logic
    let isDragging = false, startX, startY, initialLeft, initialTop;
    const header = gui.querySelector('.gui-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
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
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'move';
    });

    // Event Listeners
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
    gui.querySelector('.refresh-btn').addEventListener('click', loadQuests);
    gui.querySelector('#select-all').addEventListener('change', (e) => {
        document.querySelectorAll('.quest-checkbox').forEach(c => {
            c.checked = e.target.checked;
            c.dispatchEvent(new Event('change'));
        });
    });
    gui.querySelector('#start-btn').addEventListener('click', startQuests);
    gui.querySelector('#stop-btn').addEventListener('click', stopQuests);

    loadQuests();
};

createGUI();
