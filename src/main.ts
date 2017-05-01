import { TicTacToe } from "./TicTacToe/TicTacToe"

window.addEventListener('load', function () {
    let ticTacToe: TicTacToe = new TicTacToe(3);
    document.body.appendChild(ticTacToe.logger.el);
    document.body.appendChild(ticTacToe.boardNode);


})