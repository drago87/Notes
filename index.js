import { registerSlashCommand } from "../../slash-commands.js";
import { VariableViewer } from './src/Notes.js';

const app = new VariableViewer();

registerSlashCommand('notes', ()=>app.toggle(), [], 'show / hide the Notes panel', true, true);

$(document).ready(function () {
    app.render();
});
