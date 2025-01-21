
//Management functionality
const teacherForm = document.getElementById('teacherForm');
const studentForm = document.getElementById('studentForm');
const attendanceList = document.getElementById('attendanceList');
const showAll = document.getElementById('showAll');
const filterPresent = document.getElementById('filterPresent');
const filterAbsent = document.getElementById('filterAbsent');

let students = [];

// Add student
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    students.push({ name: studentName, status: 'Absent' });
    document.getElementById('studentName').value = '';
    renderAttendanceList();
});

// Render attendance list
function renderAttendanceList(filter = null) {
    attendanceList.innerHTML = '';
    students
        .filter(student => !filter || student.status === filter)
        .forEach((student, index) => {
            const li = document.createElement('li');
            li.className = "flex justify-between items-center p-2 border rounded-lg";
            li.innerHTML = `
                <span>${student.name}</span>
                <div>
                    <button class="bg-green-500 text-white px-3 py-1 rounded-lg mr-2" onclick="markPresent(${index})">Present</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded-lg" onclick="markAbsent(${index})">Absent</button>
                </div>
            `;
            attendanceList.appendChild(li);
        });
}

// Mark as Present
window.markPresent = (index) => {
    students[index].status = 'Present';
    renderAttendanceList();
};

// Mark as Absent
window.markAbsent = (index) => {
    students[index].status = 'Absent';
    renderAttendanceList();
};

// Show all students
showAll.addEventListener('click', () => renderAttendanceList());

// Show present students
filterPresent.addEventListener('click', () => renderAttendanceList('Present'));

// Show absent students
filterAbsent.addEventListener('click', () => renderAttendanceList('Absent'));