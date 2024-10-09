// script.js
document.addEventListener('DOMContentLoaded', function () {
  fetchLeaderboard();
});

function fetchLeaderboard() {
  fetch('leaderboard.json')
    .then(response => response.json())
    .then(data => {
      const leaderboard = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
      leaderboard.innerHTML = '';

      data.forEach(row => {
        const newRow = leaderboard.insertRow();
        const userNameCell = newRow.insertCell(0);
        const fileNameCell = newRow.insertCell(1);
        const downloadCell = newRow.insertCell(2);

        userNameCell.textContent = row.user_name;
        fileNameCell.textContent = row.file_name;
        downloadCell.innerHTML = `<a href="uploads/${row.file_name}" download>Download</a>`;
      });
    });
}
