// --- TOKEN CHECK ---
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
    window.location.href = "index.html"; // Redirect if no token
}

document.addEventListener('DOMContentLoaded', function() {
    const pendingTrainingsDiv = document.getElementById('pending-trainings');
    let pendingTrainings = JSON.parse(localStorage.getItem('pendingTrainings') || '[]');
    let submittedTrainings = JSON.parse(localStorage.getItem('submittedTrainings') || '[]');

    function displayTrainings() {
        pendingTrainingsDiv.innerHTML = '';
        if (pendingTrainings.length === 0) {
            pendingTrainingsDiv.innerHTML = '<p>No pending trainings.</p>';
            return;
        }

        // Filter trainings to only show the one with the matching token
        const trainingToShow = pendingTrainings.find(training => training.verificationToken === token);

        if (!trainingToShow) {
            pendingTrainingsDiv.innerHTML = '<p>Invalid or expired verification link.</p>';
            return;
        }

        const trainingDiv = document.createElement('div');
        trainingDiv.classList.add('mb-4', 'p-4', 'bg-white', 'shadow-md', 'rounded-md');
        trainingDiv.innerHTML = `
            <h2 class="text-xl font-semibold">${trainingToShow.title}</h2>
            <p>Organizer: ${trainingToShow.organizer}</p>
            <p>Category: ${trainingToShow.category}</p>
            <p>Cost: ${trainingToShow.cost}</p>
            <p>Location: ${trainingToShow.location}</p>
            <p>Deadline: ${trainingToShow.deadline}</p>
            <button class="approve-btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Approve</button>
            <button class="reject-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Reject</button>
        `;

        const approveBtn = trainingDiv.querySelector('.approve-btn');
        approveBtn.addEventListener('click', function() {
            submittedTrainings.push(trainingToShow);
            pendingTrainings = pendingTrainings.filter(training => training.verificationToken !== token); // Remove from pending
            updateLocalStorage();
            displayTrainings();
        });

        const rejectBtn = trainingDiv.querySelector('.reject-btn');
        rejectBtn.addEventListener('click', function() {
            pendingTrainings = pendingTrainings.filter(training => training.verificationToken !== token); // Remove from pending
            updateLocalStorage();
            displayTrainings();
        });

        pendingTrainingsDiv.appendChild(trainingDiv);
    }

    function updateLocalStorage() {
        localStorage.setItem('pendingTrainings', JSON.stringify(pendingTrainings));
        localStorage.setItem('submittedTrainings', JSON.stringify(submittedTrainings));
    }

    displayTrainings();
});