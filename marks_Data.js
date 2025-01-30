let results = [];
let subjects = [];

// Check if there are any existing results stored in localStorage
if (localStorage.getItem('results')) {
    results = JSON.parse(localStorage.getItem('results'));
}

// Add subjects dynamically
document.getElementById('addSubject').addEventListener('click', function () {
    if (subjects.length === 0) {
        const subjectNames = prompt("Enter subjects separated by commas:");
        if (subjectNames) {
            subjects = subjectNames.split(',').map(s => s.trim());
        }
    }
    updateSubjectsInput();
});

// Dynamically update subject inputs
function updateSubjectsInput() {
    const subjectsContainer = document.getElementById('subjectsContainer');
    subjectsContainer.innerHTML = '';
    subjects.forEach(subject => {
        subjectsContainer.innerHTML += `
            <div class="flex space-x-2 mt-2">
                <span class="font-medium">${subject}:</span>
                <input type="number" class="marks w-1/2 border rounded px-3 py-2" placeholder="Marks" required>
            </div>`;
    });
}

// Handle teacher form submission
document.getElementById('teacherForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value.trim();
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const accessCode = document.getElementById('accessCode').value.trim();
    const marks = [...document.querySelectorAll('.marks')].map((m, i) => ({
        subject: subjects[i],
        marks: parseInt(m.value)
    }));

    if (!studentName || !rollNumber || !accessCode || marks.some(m => isNaN(m.marks))) {
        alert("Please fill in all fields and ensure marks are numbers.");
        return;
    }

    results.push({ studentName, rollNumber, accessCode, marks });

    // Save the updated results to localStorage
    localStorage.setItem('results', JSON.stringify(results));

    updateResultsList();
    alert('Results added successfully!');
    this.reset();
});

// Update results list display
function updateResultsList() {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = results.map((result, index) => {
        const marksDetails = result.marks.map(m => `${m.subject}: ${m.marks}`).join(', ');
        return `<li class="flex justify-between p-2 bg-gray-200 rounded mt-2">
                    ${result.studentName} (Roll No: ${result.rollNumber}) - ${marksDetails}
                    <button onclick="deleteStudent(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </li>`;
    }).join('');
}

// Delete student from results
function deleteStudent(index) {
    results.splice(index, 1);
    localStorage.setItem('results', JSON.stringify(results));
    updateResultsList();
}

// Handle student form submission (search functionality)
document.getElementById('studentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchName = document.getElementById('searchName').value.trim().toLowerCase();
    const searchCode = document.getElementById('searchCode').value.trim();

    const studentResult = results.find(result => 
        result.studentName.toLowerCase() === searchName && result.accessCode === searchCode
    );

    const resultDisplay = document.getElementById('resultDisplay');
    const resultText = document.getElementById('resultText');
    const resultChart = document.getElementById('resultChart');

    if (studentResult) {
        resultText.innerText = `Name: ${studentResult.studentName}, Roll No: ${studentResult.rollNumber}`;
        resultDisplay.classList.remove('hidden');

        // Generate graph for marks
        new Chart(resultChart, {
            type: 'bar',
            data: {
                labels: studentResult.marks.map(m => m.subject),
                datasets: [{
                    label: 'Marks',
                    data: studentResult.marks.map(m => m.marks),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                responsive: true
            }
        });
    } else {
        resultText.innerText = 'No results found or incorrect code.';
        resultDisplay.classList.remove('hidden');
    }
});

// Clear form on reset
document.addEventListener('DOMContentLoaded', () => {
    updateResultsList();
});
