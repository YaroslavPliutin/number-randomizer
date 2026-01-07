const poolInput = document.getElementById("poolInput");
const testsInput = document.getElementById("testsInput");
const randomButton = document.getElementById("randomButton");
const output = document.getElementById("output");
const plusButton = document.getElementById("plusButton");
const minusButton = document.getElementById("minusButton");
const statsButton = document.getElementById("statsButton");


let testState = null;
let sessionStats = [];
let sessionId = 1;

randomButton.textContent = "Random";
plusButton.style.display = "none";
minusButton.style.display = "none";




function showNextQuestion() 
{
    if (!testState) return;

    if (testState.answered >= testState.tests) 
    {
        const percent = Math.round((testState.correct / testState.tests) * 100);
        output.style.fontSize = "70px";
        output.style.lineHeight = "1";
        output.textContent =
            "Correct: " + testState.correct +
            ", Wrong: " + (testState.tests - testState.correct) +
            ", " + percent + "%";
        
        sessionStats.push(
        {
            id: sessionId,
            pool: testState.remaining.length + testState.answered,
            tests: testState.tests,
            correct: testState.correct,
            wrong: testState.tests - testState.correct,
            percent: percent
        });
        sessionId++;

        testState = null;

        plusButton.style.display = "none";
        minusButton.style.display = "none";
        randomButton.style.display = "inline-block";
        randomButton.textContent = "Restart";
        
        return;
    }

    const idx = Math.floor(Math.random() * testState.remaining.length);
    const num = testState.remaining[idx];
    testState.remaining.splice(idx, 1);

    output.textContent = num;
}


randomButton.addEventListener("click", () => 
{
        output.style.fontSize = "270px";
        output.style.lineHeight = "0.5";
        const pool = Number(poolInput.value);
        const tests = Number(testsInput.value);


        if (!Number.isInteger(pool) || pool <= 0) {
            output.style.fontSize = "70px";
            output.style.lineHeight = "1";
            output.textContent = "Pool must be a positive number";
            return;
        }

        if (!Number.isInteger(tests) || tests < 0) {
            output.style.fontSize = "70px";
            output.style.lineHeight = "1";
            output.textContent = "Tests must be 0 or more";
            return;
        }

        if (tests === 0) 
        {
            const num = Math.floor(Math.random() * pool) + 1;
            output.textContent = num;
        } 
        else 
        {
            testState = 
            {
                remaining: Array.from({ length: pool }, (_, i) => i + 1),
                answered: 0,
                correct: 0,
                tests: tests
            };
            
            plusButton.style.display = "inline-block";
            minusButton.style.display = "inline-block";
            randomButton.style.display = "none";
            
            showNextQuestion();

        }

 });


plusButton.addEventListener("click", () => 
{
    if (!testState) return;

    testState.correct++;
    testState.answered++;

    showNextQuestion();
});

minusButton.addEventListener("click", () => 
{
    if (!testState) return;

    testState.answered++;

    showNextQuestion();
});

statsButton.addEventListener("click", () => 
{
    if (sessionStats.length === 0) 
    {
        output.style.fontSize = "70px";
        output.style.lineHeight = "1";
        output.textContent = "No stats yet";
        return;
    }

    let text = "Session history:<br>";
    for (let s of sessionStats) 
    {
        text +=
            "Session " + s.id +
            ": pool " + s.pool +
            ", tests " + s.tests +
            ", correct " + s.correct +
            ", wrong " + s.wrong +
            ", " + s.percent + "%<br>";
    }

    output.innerHTML = text;
});
