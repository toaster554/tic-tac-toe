const makeBoard = () => {
    let titles = Array(3).fill().map(() => Array(3).fill(null));

    const setTitle = (row, col, side) => {
        // if (titles[row][col] !== null) return;

        if (side !== 'x' && side !== 'o') {
            alert('Invalid side (must be x or o)');
            return;
        }

        titles[row][col] = side;
        return checkBoard(row, col);
    }

    // check the board to see if there is a winner
    // takes in the latest title that was played
    const checkBoard = (row, col) => {
        // check row
        if (titles[row][0] === titles[row][1] && titles[row][0] === titles[row][2]) {
            return titles[row][0];
        }

        // check col
        if (titles[0][col] === titles[1][col] && titles[0][col] === titles[2][col]) {
            return titles[0][col];
        }

        // check diagonal
        if (titles[1][1] !== null &&
            ((titles[0][0] === titles[1][1] && titles[1][1] === titles[2][2]) ||
            (titles[0][2] === titles[1][1] && titles[1][1] === titles[2][0]))) {
            return titles[1][1];
        }
        
        return null;
    }

    const resetBoard = () => {
        titles = Array(3).fill().map(() => Array(3).fill(null));
    }

    return {
        titles,
        setTitle,
        resetBoard
    };
};

const game = ((numRounds) => {
    let board = makeBoard();
    let curSide = 'x';
    let curRoundNum = 0;
    let numTitlesFilled = 0;
    let xScore = 0;
    let oScore = 0;

    const playMove = (row, col) => {
        if (board.titles[row][col] !== null) return;

        let winner = board.setTitle(row, col, curSide);
        let title = document.querySelector(`#t${row}-${col}`);
        if (curSide === 'x') {
            title.innerHTML = '<i class="fas fa-times fa-4x"></i>';
        } else {
            title.innerHTML = '<i class="far fa-circle fa-4x"></i>';
        }

        if (winner) {
            setTimeout(() => announceWinner(winner), 10);
            return;
        }

        // tie
        if (++numTitlesFilled === 9) {
            setTimeout(() => announceWinner('none'), 10);
            return;
        }

        curSide = (curSide === 'x') ? 'o' : 'x';
        document.querySelector('#current-player').innerHTML = curSide;
    }

    const announceWinner = (winnerSide) => {
        if (winnerSide === 'none') {
            alert('Tie!');
        } else {
            alert(`${winnerSide} won the round!`);

            let scoreDisplay = document.querySelector(`#${winnerSide}-score`);
            scoreDisplay.innerHTML = (winnerSide === 'x') ? ++xScore : ++oScore;
        }
        

        if (++curRoundNum == numRounds) {
            alert('Game Over!');
            curRoundNum = 0;
        }

        board.resetBoard();

        let titleElements = document.querySelectorAll('.title');
        titleElements.forEach(title => title.innerHTML = '');

        curSide = 'x';
        document.querySelector('#current-player').innerHTML = curSide;
    }

    const setupGame = () => {
        let titleElements = document.querySelectorAll('.title');

        titleElements.forEach(title => {
            let [row, col] = title.id.slice(1).split("-");
            row = parseInt(row);
            col = parseInt(col);

            title.addEventListener('click', () => playMove(row, col));
        });
    }

    return {setupGame};
})(5);

game.setupGame();