// quiz.datファイルのパス
const quizDataFile = 'quiz.dat';
let quizData = []; // クイズデータを格納する配列
let currentQuestionIndex = 0; // 現在の質問のインデックス
let animationInterval; // 問題文のアニメーションのインターバル
let countdownInterval; // カウントダウンのインターバルIDを保持する変数
let quizNum = 10; // 問題数
let correctNum = 0; // 正解数

// スタートボタンがクリックされたときの処理
document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    loadQuizData();
});

// 早押しボタンがクリックされたときの処理
document.getElementById('buzzButton').addEventListener('click', function() {
    stopQuestionAnimation();
    startCountdown(5); // カウントダウンを5秒で開始
    document.getElementById('buzzButton').classList.add('hidden');
    document.getElementById('countdown').classList.remove('hidden');
});

// 答え表示ボタンがクリックされたときの処理
document.getElementById('showAnswerButton').addEventListener('click', function() {
    afterJudge();
});

// 全文表示ボタンがクリックされたときの処理
document.getElementById('showFullQuestionButton').addEventListener('click', function() {
    displayFullQuestion();
});

// 正解ボタンがクリックされたときの処理
document.getElementById('correctButton').addEventListener('click', function() {
    correctNum++;
    afterJudge();
});

// 不正解ボタンがクリックされたときの処理
document.getElementById('incorrectButton').addEventListener('click', function() {
    afterJudge();
});

// 結果表示ボタンがクリックされたときの処理
document.getElementById('resultButton').addEventListener('click', function() {
    displayResult();
})

// quiz.datファイルからクイズデータを読み込む関数
function loadQuizData() {
    fetch(quizDataFile)
        .then(response => response.text())
        .then(data => {
            // ファイルの内容を行ごとに分割し、クイズデータを処理する
            const lines = data.trim().split('\n');
            quizData = lines.map(line => {
                const [question, answer] = line.split(','); // 問題文と回答をカンマで分割
                return { question: question.trim(), answer: answer.trim() };
            });

            // クイズデータをランダムに10個選択
            quizData = getRandomQuestions(quizData, quizNum);

            console.log('ランダムに選択されたクイズデータ:', quizData);

            // 最初のクイズをアニメーション表示
            animateQuestion(quizData[currentQuestionIndex].question);
        })
        .catch(error => {
            console.error('クイズデータの読み込み中にエラーが発生しました:', error);
        });
}

// 指定された数のランダムな質問を選択する関数
function getRandomQuestions(array, num) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// 問題文をアニメーション表示する関数（1文字ずつ表示するアニメーション）
function animateQuestion(questionText) {
    const questionElement = document.getElementById('question');
    questionElement.textContent = ''; // 初期化

    let charIndex = 0;
    animationInterval = setInterval(function() {
        if (charIndex < questionText.length) {
            questionElement.textContent += questionText[charIndex];
            charIndex++;
        } else {
            clearInterval(animationInterval);
            // アニメーション完了後、早押しボタンを表示するなどの処理をここに追加
        }
    }, 100); // 100ミリ秒ごとに文字を追加する
}

// 問題文のアニメーションを停止する関数
function stopQuestionAnimation() {
    clearInterval(animationInterval);
}

// カウントダウンを開始する関数
function startCountdown(seconds) {
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = seconds;
    countdownElement.classList.remove('hidden');

    countdownInterval = setInterval(function() {
        seconds--;
        countdownElement.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            displayAnswer(); // カウントダウンが0になったら答えを表示する
        }
    }, 1000); // 1秒ごとにカウントダウン
}

// カウントダウンを停止する関数
function stopCountdown() {
    clearInterval(countdownInterval);
}

// 答えを表示する関数
function displayAnswer() {
    const answerElement = document.getElementById('question');
    answerElement.textContent = quizData[currentQuestionIndex].answer;

    document.getElementById('judgeButtons').classList.remove('hidden');

    // カウントダウンを非表示にする
    const countdownElement = document.getElementById('countdown');
    countdownElement.classList.add('hidden');
}

// 正誤判定が終わった後の操作
function afterJudge() {
    const answerElement = document.getElementById('question');
    answerElement.textContent = quizData[currentQuestionIndex].answer;

    // アクションボタンを表示
    if (currentQuestionIndex >= quizData.length-1) {
        document.getElementById('nextQuestionButton').classList.add('hidden');
        document.getElementById('resultButton').classList.remove('hidden');
    }
    document.getElementById('actionButtons').classList.remove('hidden');

    // 正誤判定を非表示にする
    document.getElementById('judgeButtons').classList.add('hidden');
}

// 問題文を全文表示する関数
function displayFullQuestion() {
    const questionElement = document.getElementById('question');
    questionElement.textContent = quizData[currentQuestionIndex].question;
}

// 次の質問を表示する関数
function displayNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        animateQuestion(quizData[currentQuestionIndex].question);
        
        // 早押しボタンを表示
        document.getElementById('buzzButton').classList.remove('hidden');

        // アクションボタンを非表示
        document.getElementById('actionButtons').classList.add('hidden');

        // カウントダウンを非表示にする
        const countdownElement = document.getElementById('countdown');
        countdownElement.classList.add('hidden');
    } else {
        console.log('すべての質問が終了しました。');
    }
}

function displayResult() {
    const correctNumElement = document.getElementById('correctNum');
    correctNumElement.textContent = correctNum;  // 正解数を表示

    document.getElementById('resultScreen').classList.remove('hidden');  // 結果表示要素を表示
    document.getElementById('quizScreen').classList.add('hidden');  // クイズ画面を非表示
}

// 「次の問題へ」ボタンのクリックイベントを設定
document.getElementById('nextQuestionButton').addEventListener('click', function() {
    displayNextQuestion();
});

// ページの読み込みが完了したときにスタート画面を表示する
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('quizScreen').classList.add('hidden');
});

// クイズをリセットする関数
function resetQuiz() {
    currentQuestionIndex = 0;
    stopQuestionAnimation();
    stopCountdown();
    document.getElementById('question').textContent = 'ここにクイズの質問が表示されます。';
    document.getElementById('countdown').textContent = '5';
    document.getElementById('buzzButton').classList.remove('hidden');
    document.getElementById('countdown').classList.add('hidden');
    document.getElementById('actionButtons').classList.add('hidden');
    document.getElementById('nextQuestionButton').classList.remove('hidden');
    document.getElementById('resultButton').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    correctNum = 0;
}

function goHome() {
    resetQuiz();
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// ホームボタンがクリックされたときの処理
document.getElementById('homeButton').addEventListener('click', function() {
    goHome();
});
document.getElementById('endButton').addEventListener('click', function() {
    goHome();
})