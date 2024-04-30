function autoResizeTextarea(id) {
    var textarea = document.getElementById(id);
    textarea.style.height = 'auto';  // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px';  // Set the height to scroll height
}

// function spilitText(text) {
//     return text.split('-^-');
// }

document.getElementById('queryForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    // const input = {
    //     userInput: userInput.value
    // };
    input = document.getElementById('userInput').value.trim();
    const language = document.getElementById('language').value.trim();
    const question = document.getElementById('question').value.trim();
    const type = document.getElementById('type').value.trim();
    // console.log('User input:', input);

    // <textarea id="responseOutput" class="form-control mt-3" placeholder="Test" rows="5" disabled></textarea>
    // <textarea id="answer" class="form-control mt-3" placeholder="Answer" rows="5" disabled></textarea>
    // <textarea id="explanation" class="form-control mt-3" placeholder="Explanation" rows="5" disabled></textarea>
    const responseOutput = document.getElementById('responseOutput');
    const answer = document.getElementById('answer');
    const explanation = document.getElementById('explanation');
    const loadingIcon = document.getElementById('loadingIcon');

    if (input === "") {
        responseOutput.value = "Please enter a topic to generate a test";
        autoResizeTextarea('responseOutput'); // Resize textarea even on error
        return;
    }

    if (question !== "") {
        if (type !== "") {
            input = "Generate an advanced test with " + question + type + " about " + input;
        } else {
            input = "Generate an advanced test with " + question + " multiple choices about " + input;
        }
    } else {
        if (type !== "") {
            input = "Generate an advanced test with 5 " + type + " about " + input;
        } else {
            input = "Generate an advanced test with 5 multiple choices about " + input;
        }
    }

    if (language !== "") {
        input = input + " in " + language + " with answers and explanations. Return all the questions together, then all the answers, and finally all the explanations. Separate these three parts with @# as separators";
    } else {
        input = input + " in English with answers and explanations. Return all the questions together, then all the answers, and finally all the explanations. Separate these three parts with @# as separators";
    }

    // Show loading icon
    loadingIcon.style.display = 'block';
    responseOutput.value = "";
    answer.value = "";
    explanation.value = "";
    autoResizeTextarea('responseOutput'); // Resize empty textarea
    autoResizeTextarea('answer'); // Resize empty textarea
    autoResizeTextarea('explanation'); // Resize empty textarea

    // console.log('Making request to server...');
    fetch('/api/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({input: input})
    })
    .then(res => res.json())
    .then(data => {
        loadingIcon.style.display = 'none';
        if (data.status === 'error') {
            showAnswerBtn.style.display = 'none';
            showExplanationBtn.style.display = 'none';
            responseOutput.value = data.response || "Error making request";
            answer.value = "";
            explanation.value = "";
            autoResizeTextarea('responseOutput'); // Resize textarea even on error
            autoResizeTextarea('answer'); // Resize textarea even on error
            autoResizeTextarea('explanation'); // Resize textarea even on error
        } else {
            showAnswerBtn.style.display = 'block';
            showExplanationBtn.style.display = 'block';
            const sentences = data.response.split('@#');
            responseOutput.value = sentences[0].trim() || "No response from server";
            answer.value = sentences[1].trim() || "No answer from server";
            explanation.value = sentences[2].trim() || "No explanation from server";
            autoResizeTextarea('responseOutput'); // Resize textarea to fit new content
            autoResizeTextarea('answer'); // Resize textarea to fit new content
            autoResizeTextarea('explanation'); // Resize textarea to fit new content
        }
    })
    .catch(error => {
        // Hide loading icon and show error
        loadingIcon.style.display = 'none';
        showAnswerBtn.style.display = 'none';
        showExplanationBtn.style.display = 'none';
        console.error('Error:', error);
        responseOutput.value = "Error making request";
        answer.value = "";
        explanation.value = "";
        autoResizeTextarea('responseOutput'); // Resize textarea even on error
        autoResizeTextarea('answer'); // Resize textarea even on error
        autoResizeTextarea('explanation'); // Resize textarea even on error
    });
};

// 显示答案的按钮事件处理器
showAnswerBtn.addEventListener('click', function() {
    answer.style.display = 'block';
    autoResizeTextarea('answer'); // Resize textarea even on error
});
  
// 显示解释的按钮事件处理器
showExplanationBtn.addEventListener('click', function() {
    explanation.style.display = 'block';
    autoResizeTextarea('explanation'); // Resize textarea even on error
});