var questions =
[
  {
    "question": "Ab wann ist man Mann?",
    "answers": [
      "1 foo",
      "2 bar",
      "3 baz",
      "4 boo",
      "5 asd",
      "6 pop"
    ]
  },
  {
    "question": "Mann 2 oder 3?",
    "answers": [
      "1 foo",
      "2 bar",
      "3 baz",
      "4 boo",
      "5 asd",
      "6 pop"
    ]
  },
];

var scoreSubTitles = {
  "Mann1": "Hast Du schonmal was von Wikipedia gehört?",
  "Mann2": "Das geht noch besser!",
  "Mann3": "Du hast Dir Mühe gegeben und landest im Mittelfeld.",
  "Mann4": "Das hast Du gut gemacht!",
  "Mann5": "Super! Klasse! Toll gemacht! Sehr schön.",
  "Mann6": "Top! Klasse! Toll gemacht! Sehr schön.",
};

var state = {
	questionIndex: -1,
	questionsDone: [], // indexes
	answers: [
    {name: "Mann1", score: 0},
    {name: "Mann2", score: 0},
    {name: "Mann3", score: 0},
    {name: "Mann4", score: 0},
    {name: "Mann5", score: 0},
    {name: "Mann6", score: 0},
  ],
};

var elements = {
	quiz: document.querySelector('.quiz'),
	header: document.querySelector('.hero-header'),
	counter: document.querySelector('.counter'),
	question: document.querySelector('.question'),
	answers: Array.from(document.querySelectorAll('.answer')),
	score: document.querySelector('.score'),
	scoreTitle: document.querySelector('.score .title'),
	scoreText: document.querySelector('.score .score-text'),
	scorePercent: document.querySelector('.score .score-percent'),
};

function render() {
	var done = state.questionsDone.length >= 10;

	elements.quiz.style.setProperty('display', done ? 'none' : '');
	elements.score.style.setProperty('display', !done ? 'none' : '');
	elements.header.classList[done ? 'add' : 'remove']('hidden');

	if (done) {
    renderScore();
	} else {
    renderQuiz();
	}
}

// TODO
function renderScore() {
		saveScore();
		elements.scoreTitle.textContent = state.answersRight + '/10 richtig beantwortet!';
		var subtitle = '';
		scoreSubTitles.forEach(function(o) {
			if (state.answersRight >= o.min)
				subtitle = o.text;
		});
		elements.scoreText.textContent = subtitle;
		elements.scorePercent.textContent = getPercentage() + '% haben genau das gleiche Ergebnis erzielt wie Du!';
}

function renderQuiz() {
		var count = state.questionsDone.length + 1;
		if (count < 10)
			count = '0' + count;
		elements.counter.textContent = count;

		var q = questions[state.questionIndex];
		elements.question.textContent = q.question;

    var answerElements = elements.answers.slice(0);
		answerElements.sort(function() { return 0.5 - Math.random();  });
		answerElements.forEach(function (el, i) {
      el.textContent = q.answers[i];
      el.dataset.answerIndex = i;
		});
}

function saveScore() {
	var score = JSON.parse(localStorage.getItem('score') || '{}');
	for (var i = 1; i <= 10; i++) {
		if (!score[i])
			score[i] = 0;
	}
	score[state.answersRight]++;
	localStorage.setItem('score', JSON.stringify(score));
}

function getPercentage() {
	var score = JSON.parse(localStorage.getItem('score'));
	var total = 0;
	for (var key in score) {
		total = total + score[key];
	}
	return Math.round(score[state.answersRight] / total * 100);
}

function newQuestion() {
	do {
		state.questionIndex = Math.floor(Math.random() * questions.length);
	} while (state.questionsDone.indexOf(state.questionIndex) !== -1)
}

function selectAnswer(event) {
  var answerIndex = event.target.dataset.answerIndex;
  state.answers[answerIndex].score++;

	state.questionsDone.push(state.questionIndex);

	var done = function() {
		setTimeout(function() {
			newQuestion();
			addEvents();
			render();
		}, 400);
	};

	removeEvents();
	event.target.classList.add('clicked');
	setTimeout(function() {
		event.target.classList.remove('clicked');
    done();
	}, 400);
}

function addEvents() {
	elements.answers.forEach(function(el) {
		el.addEventListener('click', selectAnswer);
	});
}

function removeEvents() {
	elements.answers.forEach(function(el) {
		el.removeEventListener('click', selectAnswer);
	});
}

function init() {
	newQuestion();
	addEvents();
	render();
}

init();
