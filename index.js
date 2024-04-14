import { registerSlashCommand } from "../../slash-commands.js";
import { Notes } from './src/Notes.js';

const app = new Notes();

registerSlashCommand('notes', ()=>app.toggle(), [], 'show / hide the Notes panel', true, true);

$(document).ready(function () {
    app.render();
});
