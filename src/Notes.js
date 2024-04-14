import { callPopup, chat_metadata, saveSettingsDebounced } from '../../../../../script.js';
import { dragElement } from '../../../../RossAscends-mods.js';
import { extension_settings } from '../../../../extensions.js';
import { loadMovingUIState } from '../../../../power-user.js';
import { executeSlashCommands } from '../../../../slash-commands.js';
import { delay } from '../../../../utils.js';

export class Notes {
	/**@type {Boolean}*/ isShown = true;
    /**@type {Boolean}*/ isRunning = false;

    /**@type {HTMLElement}*/ dom;
    /**@type {HTMLElement}*/ content;


	constructor() {
        if (!extension_settings.notes) {
            extension_settings.notes = {};
            if (extension_settings.notes.isShown === undefined) {
                extension_settings.notes.isShown = true;
            }
            if (extension_settings.notes.fontSize === undefined) {
                extension_settings.notes.fontSize = 1.0;
            }
            saveSettingsDebounced();
        }
        this.isShown = extension_settings.notes.isShown;
        this.fontSize = extension_settings.notes.fontSize;
    }
	
	toggle() {
        this.isShown = !this.isShown;
        if (this.isShown) {
            this.render();
        } else {
            this.unrender();
        }
        extension_settings.notes.isShown = this.isShown;
        saveSettingsDebounced();
    }
	
	increaseFontSize() {
        this.fontSize += 0.05;
        this.saveFontSize();
    }
    decreaseFontSize() {
        this.fontSize -= 0.05;
        this.saveFontSize();
    }
    saveFontSize() {
        this.content.style.fontSize = `${this.fontSize}em`;
        extension_settings.notes.fontSize = this.fontSize;
        saveSettingsDebounced();
    }
	
	unrender() {
        this.dom?.remove();
    }
    render() {
        this.unrender();
        if (!this.isShown) return;
        if (!this.dom) {
            const root = document.createElement('div'); {
                this.dom = root;
                root.id = 'vv--root';
                root.classList.add('vv--root');
                root.classList.add('fillRight');
                root.classList.add('drawer-content');
                root.classList.add('openDrawer');
                //drawer-content fillRight openDrawer
                root.classList.add('pinnedOpen');
                root.classList.add('draggable');
                const fontSizeUp = document.createElement('div'); {
                    fontSizeUp.classList.add('vv--fontSizeUp');
                    fontSizeUp.classList.add('hoverglow');
                    fontSizeUp.textContent = '🗚';
                    fontSizeUp.title = 'Increase font size';
                    fontSizeUp.addEventListener('click', ()=>this.increaseFontSize());
                    root.append(fontSizeUp);
                }
                const fontSizeDown = document.createElement('div'); {
                    fontSizeDown.classList.add('vv--fontSizeDown');
                    fontSizeDown.classList.add('hoverglow');
                    fontSizeDown.title = 'Decrease font size';
                    fontSizeDown.textContent = '🗛';
                    fontSizeDown.addEventListener('click', ()=>this.decreaseFontSize());
                    root.append(fontSizeDown);
                }
                const max = document.createElement('div'); {
                    max.classList.add('vv--maximize');
                    max.classList.add('hoverglow');
                    max.title = 'Maximize';
                    max.textContent = '◱';
                    max.addEventListener('click', ()=>root.classList.toggle('vv--maximized'));
                    root.append(max);
                }
                const move = document.createElement('div'); {
                    move.id = 'vv--rootheader';
                    move.classList.add('vv--move');
                    move.classList.add('fa-solid');
                    move.classList.add('fa-grip');
                    move.classList.add('drag-grabber');
                    move.classList.add('hoverglow');
                    root.append(move);
                }
                const close = document.createElement('div'); {
                    close.classList.add('vv--close');
                    close.classList.add('fa-solid');
                    close.classList.add('fa-circle-xmark');
                    close.classList.add('hoverglow');
                    close.title = 'Close panel';
                    close.addEventListener('click', ()=>this.toggle());
                    root.append(close);
                }
                const content = document.createElement('div'); {
                    this.content = content;
                    content.classList.add('vv--content');
                    content.style.fontSize = `${this.fontSize}em`;
                    /*
                    [['Local', false], ['Global', true]].forEach(([panelTitle,global])=>{
                        const panel = document.createElement('div'); {
                            panel.classList.add('vv--entry');
                            panel.classList.add('inline-drawer');
                            const title = document.createElement('div'); {
                                title.classList.add('vv--title');
                                const toggleWrapper = document.createElement('div'); {
                                    toggleWrapper.classList.add('inline-drawer-toggle');
                                    const toggle = document.createElement('div'); {
                                        toggle.classList.add('inline-drawer-icon');
                                        toggle.classList.add('fa-solid');
                                        toggle.classList.add('fa-circle-chevron-up');
                                        toggle.classList.add('down');
                                        toggleWrapper.append(toggle);
                                    }
                                    title.append(toggleWrapper);
                                }
                                const lbl = document.createElement('div'); {
                                    lbl.classList.add('vv--label');
                                    lbl.textContent = String(panelTitle);
                                    title.append(lbl);
                                }
                                const add = document.createElement('div'); {
                                    add.classList.add('vv--add');
                                    add.textContent = '➕';
                                    add.title = 'Add new variable';
                                    add.addEventListener('click', async()=>{
                                        const name = await callPopup('Variable Name', 'input', '', { okButton:'OK', rows:1, wide:false, large:false });
                                        if (!name) {
                                            return;
                                        }
                                        const val = await callPopup('Variable Value', 'input', '', { okButton:'OK', rows:1, wide:false, large:false });
                                        if (val === null || val === undefined) {
                                            return;
                                        }
                                        executeSlashCommands(`/set${global ? 'global' : ''}var key="${name}" ${val}`);
                                    });
                                    title.append(add);
                                }
                                panel.append(title);
                            }
                            const vars = document.createElement('div'); {
                                this[`${global ? 'global' : 'local'}Panel`] = vars;
                                vars.classList.add('vv--vars');
                                vars.classList.add('inline-drawer-content');
                                vars.style.display = 'block';
                                panel.append(vars);
                            }
                            this.content.append(panel);
                        }
                    });*/
                    root.append(content);
                }
            }
        }
        document.body.append(this.dom);
        loadMovingUIState();
        dragElement($(this.dom));

        this.update();
    }

    async update() {
        if (this.isRunning) return;
        this.isRunning = true;
        while (this.isShown) {
            /*
            const localVars = chat_metadata.variables ?? {};
            const globalVars = extension_settings?.variables?.global ?? {};
            const lv = JSON.stringify(localVars);
            const gv = JSON.stringify(globalVars);
            if (lv != this.oldLocalVars || gv != this.oldGlobalVars) {
                this.oldLocalVars = lv;
                this.oldGlobalVars = gv;
                console.log('[STVV]', localVars, globalVars);
                await this.updateVars(this.localVarList, localVars, this.localPanel, false);
                await this.updateVars(this.globalVarList, globalVars, this.globalPanel, true);
            */
            }
            await delay(200);
        }
        this.isRunning = false;
    }
}