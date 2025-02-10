//Elizabeth Ramdeo JS script for tictactoe

let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('#reset');
let playerX= true;
let newGameBtn = document.querySelector('#new-btn');
let msgContainer = document.querySelector('.msg-container');
let msg = document.querySelector('#msg');

const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

boxes.forEach((box) => {
    box.addEventListener('click', function(){
        if(playerX && box.innerText===""){
            box.innerText = 'X';
            box.style.color = "white";
            playerX= false;
            box.disabled=true;
            if(!checkForWin()){
                setTimeout(computerPlay, 500);
            }
        } 
    });
});

const computerPlay = () =>{
    let bestPlay = minimax(true).index;

    if(bestPlay !== -1){
        let box= boxes[bestPlay];
        box.innerText="O";
        box.style.color="black";
        box.disabled=true;
        playerX=true;
        checkForWin();
    }
};

const minimax = (isMaximizing)=> {
    let availablePlays = getAvailablePlays();

    let winner = checkImmediateWinner();
    if(winner === "O"){
        return {score: 10};//computer win
    }
    if(winner === "X"){
        return {score: -10};//player win
    }
    if(availablePlays.length===0){
        return{score:0};
    }

    let bestPlay = isMaximizing ? { score: -Infinity, index: -1 } : { score: Infinity, index: -1 };

    availablePlays.forEach(index => {
        boxes[index].innerText = isMaximizing ? 'O' : 'X'; 
        let score = minimax(!isMaximizing).score; 
        boxes[index].innerText = ""; 

        if (isMaximizing) {
            if (score > bestPlay.score) bestPlay = { score, index };
        } else {
            if (score < bestPlay.score) bestPlay = { score, index };
        }
    });

    return bestPlay;

};

const getAvailablePlays = () => {
    return [...boxes].map((box, index) => box.innerText === "" ? index : null).filter(index => index !== null);
};

// Check if someone has already won
const checkImmediateWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[b].innerText === boxes[c].innerText) {
            return boxes[a].innerText;
        }
    }
    return null;
};

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled= false;
        box.innerText="";
    }
};

const disableBoxes =() =>{
    for(let box of boxes){
        box.disabled=true;
    }
};

const showWinner = (winner) =>{
    msg.innerText = `Congratulations ${winner}. You have won!`;
    msgContainer.classList.remove('hide');
    disableBoxes();
};

const checkForWin =() => {
    let winner = checkImmediateWinner();
    if (winner) {
        showWinner(winner);
        return true;
    }

    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = 'Match Drawn';
        msgContainer.classList.remove('hide');
        return true;
    }
    return false;
};

const resetGame =()=>{
    playerX= true;
    enableBoxes();
    msgContainer.classList.add('hide');
};

newGameBtn.addEventListener('click', resetGame);
resetBtn.addEventListener('click', resetGame);
