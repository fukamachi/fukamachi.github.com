var calculateScore = function() {
  var form = document.getElementsByClassName('calculator-form')[0];
  var salary = parseInt(form.money.value);
  if (salary !== salary) {
    return null;
  }
  var loc = form.location.value;
  var isRemote = form.remote.checked;
  var after11 = form.start.checked;

  var languagesScores = {
    "common lisp": 300,
    "javascript": 80,
    "go": 80,
    "python": 50,
    "perl": 50,
    "php": -10000,
    "java": -10000,
    "scala": -1000,
    "groovy": -3000,
    "clojure": -500
  };

  var score = 0;
  for (var i=0; i<form.language.options.length; ++i) {
    if (form.language.options[i].selected) {
      score += languagesScores[form.language.options[i].value] || 0;
    }
  }
  if (salary <= 0) {
    score += -100000;
  }
  else if (0 < salary && salary < 500) {
    score += (salary - 500) * 10;
  }
  else {
    score += (salary - 500);
  }
  if (loc === 'outside' && !isRemote) {
    score += -300;
  }

  if (isRemote) {
    score += 50;
  }

  if (after11) {
    score += 20;
  }

  return score;
};

var onChangeForm = function() {
  var score = calculateScore();
  var scoreContainer = document.getElementsByClassName('result')[0].getElementsByClassName('score-container')[0];
  document.getElementById('score').innerHTML = score === null ? '???' : score;
  if (score < 130) {
    scoreContainer.className = 'score-container bad';
  }
  else if (130 <= score) {
    scoreContainer.className = 'score-container good';
  }

  var form = document.getElementsByClassName('calculator-form')[0];
  var email = document.getElementById('email-link');

  var languages = [];
  for (var i=0; i<form.language.options.length; ++i) {
    if (form.language.options[i].selected) {
      languages.push(form.language.options[i].innerHTML);
    }
  }

  var subject = '雇用先の募集について (Score:' + score +')';
  var bodyMap = {
    '必須言語': languages.join(', '),
    '最低年収': form.money.value + '万円',
    '勤務地': form.location.value === 'inside' ? '関東圏' : 'それ以外',
    'リモートワーク': form.remote.checked ? '可' : '不可',
    '出社時刻': form.start.value === 'before11' ? '11時より早く'
      : form.start.value === 'no' ? '問わない'
      : '11時以降'
  };
  var body = '\n\n----- 入力情報 -----\n' + Object.keys(bodyMap).map(function(key) {
    return key + ': ' + this[key];
  }, bodyMap).join('\n');
  email.href = 'mailto:e.arrows@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
};
