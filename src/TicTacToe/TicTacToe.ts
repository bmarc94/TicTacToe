import { Square } from "../Square/Square";
import { Player } from "../Player/Player";
import { Logger } from "../logger/Logger"

export class TicTacToe {
    private _board: Square[][] = [];
    private _players: Player[] = [];
    private _currentPlayer: Player;
    private _gameOver: Boolean = false;
    private _logger: Logger = new Logger();
    private _squareFilledLength: number = 0;
    public boardNode: HTMLDivElement = document.createElement('div');
    

    constructor(private squareSideLength: number) {
        this.buildBoard();
        this.createPlayers(["X", "O"]);
        this._currentPlayer = this._players[0];
        this.logger.log("Game Not Over");
    }

    get logger(){
        return this._logger;
    }

    /**
     * créé le tableau
     */
    private buildBoard():void {
        this.boardNode.setAttribute('class', 'board');
        for (let row = 0; row < this.squareSideLength; row++) {
            let line: HTMLDivElement = document.createElement('div');
            line.setAttribute('class', 'row');
            this._board.push([]);

            for (let col = 0; col < this.squareSideLength; col++) {
                let square: Square = new Square();
                this._board[row].push(square);

                ((r, c) => {
                    square.addChangeStateCallBack(() => {
                        this.onSquareChnageState(r, c);
                    });
                })(row, col)


                line.appendChild(square.el);
            }
            this.boardNode.appendChild(line);
        }
    }

    /**
     * Créé les joueurs
     * @param array symbolPlayers symbol du joueur détérmine potentiellement le nombre de joueurs
     */
    private createPlayers(symbolPlayers: string[]):void {
        symbolPlayers.forEach((symbol, index) => {
            this._players.push(new Player("Joueur " + symbol, symbol));
        })
    }

    /**
     * notification du changement d'un click sur une case. 
     * Rempli la case en fonction du symbole du joueur courrant
     * Vérifie si un joueur a gagné
     * log l'état du tableau
     * @param row index ligne
     * @param col index colonne
     */

    private onSquareChnageState(row: number, col: number):void {
        //debugger;
        if (!this._board[row][col]) {
            throw new Error("La case x" + row + ":y" + col + " n'existe pas !");
        }
        if (!this._gameOver) {
            this._squareFilledLength++;
            this._board[row][col].symbol = this._currentPlayer.symbol;
            this.logBoard();

            if (this.currentPlayerHasWon()) {
                this._gameOver = true;
                this.logger.log(this._currentPlayer.name + " won.");

            } else if (Math.sqrt(this._squareFilledLength) === this._board.length) {
                this._gameOver = true;
                this.logger.log("No Winner");

            } else {
                this.switchPlayer();
            }
        }
        
    }

    /**
     * Change le joueur
     */
    private switchPlayer():void {
        this._currentPlayer = this._currentPlayer == this._players[0] ? this._players[1] : this._players[0];
        //this.logger.log(this._currentPlayer.name + " joue.");
    }

    /**
     * Vérifie si le jouer a réussi a complété une linge
     * @return true/false
     */

    private currentPlayerHasWon(): Boolean {
        let symbol = this._currentPlayer.symbol;
        let rowCheck;
        let lastColIndex = this._board.length;
        let currentPlayerHasWon: Boolean = false;
        let winPath: any = {
            row: [],
            col: [],
            originDiagonal: [],
            opositeDiagonal: []
        }
        /*check rows*/
        for (let i = 0, l = this._board.length; i < l; i++) {
            /*vérifie les lignes */
            if (winPath["row"].length === 0) {
                winPath["row"] = this.checkWinningRow(i);
            }

            /*vérifie les colonnes */
            if (winPath["col"].length === 0) { /*test si un colonne a été rempli*/
                winPath["col"] = this.checkWinningCol(i);
            }

            /*vérifie la diagonale partant de l'origine*/
            if (this._board[i][i].symbol === this._currentPlayer.symbol) {
                winPath["originDiagonal"].push(this._board[i][i]);
            }

            /*/*vérifie la diagonale oposée */
            if (this._board[i][--lastColIndex].symbol === this._currentPlayer.symbol) {
                winPath["opositeDiagonal"].push(this._board[i][lastColIndex]);
            }
        }

        for (let i in winPath) {
            if (winPath[i].length === this._board.length) {
                currentPlayerHasWon = true;
                this.lightInlineSquares(winPath[i]);
            }
        }

        return currentPlayerHasWon;
    }
    /**
     * éclaire toutes les cases de la liste
     * @param squares liste de case
     */
    private lightInlineSquares(squares: Square[]):void {
        if (squares.length === this._board.length) {
            squares.forEach((square: Square) => {
                square.light();
            })
        }
    }
    /**
     * Vérifie si le joueur rempli une ligne
     * @param rowIndex index de la ligne à vérifier
     * @return array vide ou de case en cas de réussite
     */
    private checkWinningCol(rowIndex: number): Square[] {
        let currentPlayerFilledSquare: Square[] = [];
        for (let j = 0; j < this._board.length; j++) {
            let square = this._board[j][rowIndex];
            if (square.symbol === this._currentPlayer.symbol) {
                currentPlayerFilledSquare.push(square);
                continue;
            }
            
            break;
        }
        return currentPlayerFilledSquare;
    }
    /**
     * Vérifie si le joueur rempli une ligne
     * @param colIndex index de la colonne à vérifier
     * @return array vide ou de case en cas de réussite
     */

    private checkWinningRow(colIndex: number): Square[] {
        let currentPlayerFilledSquare: Square[] = [];
        for (let i = 0; i < this._board.length; i++) {
            let square = this._board[colIndex][i];
            if (square.symbol === this._currentPlayer.symbol) {
                currentPlayerFilledSquare.push(square);
                continue;
            }
            currentPlayerFilledSquare.length = 0;
            break;
        }
        return currentPlayerFilledSquare;
    }

    /**
     * log l'état du tableau
     */
    private logBoard():void {
        let boardLog = "";
        this._board.forEach((row, i) => {
            let rowLog = "|";
            this._board[i].forEach((square, j) => {
                rowLog += (this._board[i][j].symbol || " ") + "|";
            })
            boardLog += rowLog + "\n";
        })
        this.logger.console(boardLog);
    }
}