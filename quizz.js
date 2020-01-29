//Initialization variables
let index_question = 0;
let nb_question = 10;
let right_ans;
let score = 0;
let option;
let interval;
let questions = {};

let highscore = localStorage.getItem("highscore");//Initialize the highscore

//Function allowing the user to choose the theme of the quizz
function chooseTheme() {
  let theme = document.getElementsByName("options");
  for (let i = 0; i < theme.length; i++) {
    if (theme[i].checked == true) {
      option = theme[i].id;
    }
  }
  document.getElementById("selectTheme").classList.add("d-none");
  document.getElementById("quizz").classList.remove("d-none");
  fetch(`http://localhost:8080/${option}.json`)
    .then(result => result.json())
    .then(data => {
      questions.results = shuffle(data.results);//Shuffle the question array
      loadQuestion(questions);//Load the first question with the theme
    });
}

//Loop starter with the first question
function loadQuestion(data) {
  timer();//Launch timer
  //Check if it's the last question
  if (index_question < nb_question) {
    document.getElementById("answer").innerHTML = "";//Reset of the answer part and disable the button
    document.getElementById("index_question").innerHTML = "Question: " + (index_question + 1);//Display of the question number
    const question = data.results[index_question].question;//Get the question in the data array
    document.getElementById("question").innerHTML = question;//Display the question
    let answers = [];
    let other_answer = data.results[index_question].autres_choix;
    //Fill the answers array with wrong answers
    for (let i = 0; i < other_answer.length; i++) {
      answers.push({ reponse: other_answer[i], value: "uncorrect" });
    }
    //Fill the answers array with the right answer
    answers.push({
      reponse: data.results[index_question].reponse_correcte,
      value: "correct"
    });
    answers = shuffle(answers);//Shuffle the table
    //Display button with answers
    for (let i = 0; i < answers.length; i++) {
      document.getElementById("answers_button").innerHTML += `<button class="btn btn-warning" id="btn${i}"></button>`;
      document.getElementById("btn" + i).innerHTML = answers[i].reponse;
      //Set the different actions on the button
      if (answers[i].value == "correct") {
        document
          .getElementById("btn" + i)
          .setAttribute("onclick", "correct()");
        right_ans = answers[i].reponse;
      } else {
        document
          .getElementById("btn" + i)
          .setAttribute("onclick", "uncorrect()");
      }
    }
    return right_ans;
  }
  //Display the end of the quizz with the final score
  else {
    clearInterval(interval);
    if (highscore !== null) { //Check if there's already an highscore
      if (score > highscore) {//Change the old highscore
        localStorage.setItem("highscore", score);
        document.getElementById("answer").innerHTML =
          `<h2>Quizz fini!</h2>
              <p>Ceci est votre meilleur score ! Il est de ${score} points<br/>
              Bravo !</p>
              <button onClick="window.location.reload()" class="btn btn-warning">Rejouer</button>`;//Add a button to reload the page
      }
      else {//Simply display the score
        document.getElementById("answer").innerHTML =
          `<h3>Quizz fini!</h3>
              <p>Votre score est de ${score} points</p>
              <button onClick="window.location.reload()" class="btn btn-warning">Rejouer</button>`;//Add a button to reload the page
      }
    }
    else {//Set the new highscore to the actual score
      localStorage.setItem("highscore", score);
      document.getElementById("answer").innerHTML =
        `<h3>Quizz fini!</h3>
              <p>Votre score est de ${score} points</p>
              <button onClick="window.location.reload()" class="btn btn-warning">Rejouer</button>`;//Add a button to reload the page
    }
    document.getElementById("question").innerHTML = "";
  }
}

//10s Timer function
function timer() {
  let timer = 9;
  interval = setInterval(function () {
    document.getElementById("answer").innerHTML = `<p>Temps restant: ${timer}s</p>`;//Display the time left
    timer--;//Decrement the timer value

    if (timer <= 0) {//Check if the timer is still going
      clearInterval(interval);
      document.getElementById("answers_button").innerHTML = "";
      document.getElementById("answer").innerHTML =
        `<p>Trop tard, la bonne réponse était: ${right_ans}</p>
    <button onclick="next()" class="btn btn-warning">Question suivante</button>`;//Add a button to display the next question
    }
  }, 1000);
}

//Increase the score value and display the next question button
function correct() {
  score++;//Increment score
  clearInterval(interval);//Delete timer
  document.getElementById("answers_button").innerHTML = "";
  document.getElementById("answer").innerHTML = `<p>Bonne réponse</p>
    <button onclick="next()" class="btn btn-warning">Question suivante</button>`;//Add a button to display the next question
}
//Display the right answer and the next question button
function uncorrect() {
  clearInterval(interval);//Delete timer
  document.getElementById("answers_button").innerHTML = "";
  document.getElementById("answer").innerHTML =
    `<p>Mauvaise réponse, la bonne réponse était: ${right_ans}</p>
    <button onclick="next()" class="btn btn-warning">Question suivante</button>`;//Add a button to display the next question
}

//Display the next question
function next() {
  index_question++;
  loadQuestion(questions);
}

//Simple function to shuffle an array
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}