/**
 * Game is assembled here
 */

import {GameModel} from "../Model/GameModel.js";
import {GameViewer} from "../Viewer/GameViewer.js";
import {GamePresenter} from "../Presenter/GamePresenter.js";

class GameMain{
    constructor(){
        this.gameModel = new GameModel();
        this.gameViewer = new GameViewer();
        this.gamePresenter = new GamePresenter(this.gameModel, this.gameViewer);
        this.gameViewer.registerWith(this.gamePresenter);
    }
}