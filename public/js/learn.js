function autoResizeTextarea(id) {
    var textarea = document.getElementById(id);
    textarea.style.height = 'auto';  // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px';  // Set the height to scroll height
}

document.getElementById('queryForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    // const input = {
    //     userInput: userInput.value
    // };
    input = document.getElementById('userInput').value.trim();
    const language = document.getElementById('language').value;
    // console.log('User input:', input);
    const responseOutput = document.getElementById('responseOutput');
    const loadingIcon = document.getElementById('loadingIcon');

    if (input === "") {
        responseOutput.value = "Please enter a question or topic to learn about";
        autoResizeTextarea('responseOutput'); // Resize textarea even on error
        return;
    }

    input = "explain " + input;
    if (language !== "") {
        input = input + " in " + language;
    } else {
        input = input + " in English";
    }

    // Show loading icon
    loadingIcon.style.display = 'block';
    responseOutput.value = "";
    autoResizeTextarea('responseOutput'); // Resize empty textarea

    // console.log('Making request to server...');
    fetch('/api/learn', {
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
            responseOutput.value = data.response || "Error making request";
            autoResizeTextarea('responseOutput'); // Resize textarea even on error
        } else {
            responseOutput.value = data.response || "No response from server";
            autoResizeTextarea('responseOutput'); // Resize textarea to fit new content
        }
        // Hide loading icon
    })
    .catch(error => {
        // Hide loading icon and show error
        loadingIcon.style.display = 'none';
        console.error('Error:', error);
        responseOutput.value = "Error making request";
        autoResizeTextarea('responseOutput'); // Resize textarea even on error
    });
};