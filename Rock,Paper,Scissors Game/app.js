function getComputerChoices() {
    const choices = ["ROCK", "PAPER", "SCISSORS"];
    const randomChoices = Math.floor(Math.random() * choices.length);
    return choices[randomChoices];
};

function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection.toUpperCase();

    if (
        (playerSelection === "SCISSORS" && computerSelection === "ROCK") ||
        (playerSelection === "PAPER" && computerSelection === "SCISSORS") ||
        (playerSelection === "ROCK" && computerSelection === "PAPER")
    ) {
        return `you Lose!${computerSelection}beats${playerSelection}`;
    } else if (
        (playerSelection === "SCISSORS" && computerSelection === "PAPER") ||
        (playerSelection === "PAPER" && computerSelection === "ROCK") ||
        (playerSelection === "ROCK" && computerSelection === "SCISSORS")
    ) {
        return `you Won!${playerSelection}beats${computerSelection}`;
    } else {
        return "Thats a tie!"
    }
};

function game() {
    let playerScore = 0;
    let computerScore = 0;
    for(let i = 1;i < 5; i++) {
        const playerSelection = prompt("Enter your choice, ROCK, PAPER or SCISSORS: ").toUpperCase();
        const computerSelection = getComputerChoices();
        const result = playRound(playerSelection , computerSelection);
        console.log(result);
        if (result.includes("Won")) {
            playerScore++;
        } else if (result.includes("Lose")) {
            computerScore++;
        }
    }
    console.log(`Player score: ${playerScore} vs Computer score: ${computerScore}`);
};

game()