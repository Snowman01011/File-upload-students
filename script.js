// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');
    const leaderboardTableBody = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(uploadForm);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            messageDiv.textContent = data;
            uploadForm.reset();
            loadLeaderboard(); // Refresh the leaderboard after upload
        })
        .catch(error => {
            messageDiv.textContent = 'Error: ' + error.message;
        });
    });

    function loadLeaderboard() {
        fetch('/leaderboard')
            .then(response => response.json())
            .then(data => {
                // Clear the existing leaderboard entries
                leaderboardTableBody.innerHTML = '';
                // Populate the leaderboard
                data.forEach(entry => {
                    const row = leaderboardTableBody.insertRow();
                    row.insertCell(0).textContent = entry.fileName;
                    row.insertCell(1).textContent = entry.userEmail;
                    row.insertCell(2).textContent = new Date(entry.uploadedAt).toLocaleString();
                });
            })
            .catch(error => {
                console.error('Error loading leaderboard:', error);
            });
    }

    // Initial load of leaderboard
    loadLeaderboard();
});
