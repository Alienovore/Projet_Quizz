//Initialization variables
let index_question = 0;
let nb_question = 10;
let right_ans;
let score = 0;

//Loop starter with the first question

function chooseTheme() {
  let theme = document.getElementsByName("options");
  let option = undefined;
  for (let i = 0; i < theme.length; i++) {
    if (theme[i].checked == true) {
      option = theme[i].id;
    }
  }
  document.getElementById("selectTheme").classList.add("d-none");
  document.getElementById("quizz").classList.remove("d-none");
  loadQuestion(option);
}

function loadQuestion(theme) {
  //Check if it's the last question
  if (index_question < nb_question) {
    //Reset of the answer part and disable the button
    document.getElementById("answer").innerHTML = "";
    //Display of the question number
    document.getElementById("index_question").innerHTML =
      "Question: " + (index_question + 1);
    fetch(`http://localhost:8080/${theme}.json`)
      .then(result => result.json())
      .then(data => {

        const question = data.results[index_question].question;
        //Display the question
        document.getElementById("question").innerHTML = question;

        let answers = [];
        let other_answer = data.results[index_question].autres_choix;

        //Fill the answers table with wrong answers
        for (let j = 0; j < other_answer.length; j++) {
          answers.push({ reponse: other_answer[j], value: "uncorrect" });
        }

        //Fill the answers table with the right answer
        answers.push({
          reponse: data.results[index_question].reponse_correcte,
          value: "correct"
        });

        //Shuffle the table
        answers = shuffle(answers);
        //Display button with answers
        for (let i = 0; i < answers.length; i++) {
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
      });
  }
  //Display the end of the quizz with the final score
  else {
    document.getElementById("answer").innerHTML =
      `<h3>Quizz fini!</h3>
        <p>Votre score est de ` +
      score +
      ` points</p>`;
  }
}

//Increase the score value and display the next question button
function correct() {
  score++;
  document.getElementById("answer").innerHTML = `<p>Bonne réponse</p>
    <button onclick="next()">Question suivante</button>`;
}
//Display the right answer and the next question button
function uncorrect() {
  document.getElementById("answer").innerHTML =
    `<p>Mauvaise réponse, la bonne réponse était: ` +
    right_ans +
    `</p>
    <button onclick="next()">Question suivante</button>`;
}

//Reload the quizz with the next question
function next() {
  console.log;
  index_question++;
  loadQuestion();
}

//Simple function to shuffle an array
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
