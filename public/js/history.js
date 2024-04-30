document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok for learn-history.');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'error') {
            console.log('Error:', data.message);
        }
        const learnHistoryList = document.getElementById('learnHistoryList');
        // 假设返回的数据是一个数组
        console.log(data.learning);

        data.learning.forEach(historyItem => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
            <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseLearn${historyItem.learn_id}" role="button" aria-expanded="false" aria-controls="collapseLearn${historyItem.learn_id}">
              ${historyItem.topic}
            </a>
            <div class="collapse" id="collapseLearn${historyItem.learn_id}">
              <div class="card card-body">
                ${historyItem.response}
              </div>
            </div>`;
            // listItem.innerHTML = `${historyItem.topic}<br><br>${historyItem.response}`; // Use <br> to create a new line
            learnHistoryList.appendChild(listItem);
        });

        console.log(data.testing);

        const testHistoryList = document.getElementById('testHistoryList');
        // 假设返回的数据是一个数组
        data.testing.forEach(test_historyItem => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
            <a class="btn btn-link" data-bs-toggle="collapse" href="#collapseTest${test_historyItem.test_id}" role="button" aria-expanded="false" aria-controls="collapseTest${test_historyItem.test_id}">
              ${test_historyItem.topic}
            </a>
            <div class="collapse" id="collapseTest${test_historyItem.test_id}">
              <div class="card card-body">
                ${test_historyItem.response}
              </div>
            </div>`;
            // listItem.innerHTML = `${historyItem.topic}<br><br>${historyItem.response}`; // Use <br> to create a new line
            testHistoryList.appendChild(listItem);
        });

    })
    .catch(error => {
        console.error('Error fetching histories:', error);
    });
});
