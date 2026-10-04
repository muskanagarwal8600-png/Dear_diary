function startWriting() {
    alert("Your journal is ready! 🩵");

    document.querySelector(".welcome-card").style.display = "none";
    document.querySelector(".journal-card").style.display = "block";
}


function selectMood(button) {

    document.querySelectorAll(".moods button").forEach(function(mood) {
        mood.classList.remove("selected");
    });

    button.classList.add("selected");
}


const today = new Date();

document.getElementById("journalDate").textContent =
    today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


function saveEntry() {

    const textareas = document.querySelectorAll(".journal-card textarea");

    const entry = {
        date: document.getElementById("journalDate").textContent,
        mood: document.querySelector(".moods button.selected")?.textContent || "No mood selected",
        day: textareas[0].value,
        win: textareas[1].value,
        grateful: textareas[2].value
    };

    let entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

    entries.push(entry);

   localStorage.setItem("diaryEntries", JSON.stringify(entries));

document.querySelector(".journal-card").style.display = "none";
document.querySelector(".closing-card").style.display = "block";
}

function showEntries() {

    const savedEntries = localStorage.getItem("diaryEntries");

    if (!savedEntries) {
        alert("You don't have any saved entries yet 🩵");
        return;
    }

    const entries = JSON.parse(savedEntries);

    let message = "📖 Your Diary Entries\n\n";

    entries.slice().reverse().forEach(function(entry, index) {

        message += "Entry " + (index + 1) + "\n";
        message += "Date: " + entry.date + "\n";
        message += "Mood: " + entry.mood + "\n\n";

        message += "How was your day?\n";
        message += entry.day + "\n\n";

        message += "Today's tiny win:\n";
        message += entry.win + "\n\n";

        message += "Something I'm grateful for:\n";
        message += entry.grateful + "\n";

        message += "\n----------------------\n\n";
    });

    alert(message);
}

function goHome() {

    document.querySelector(".closing-card").style.display = "none";
    document.querySelector(".welcome-card").style.display = "block";

}


function downloadEntries() {

    const savedEntries = localStorage.getItem("diaryEntries");

    if (!savedEntries) {
        alert("You don't have any saved entries yet 🩵");
        return;
    }

    const entries = JSON.parse(savedEntries);

    let csv = "Date,Mood,How was your day?,Today's tiny win,Something I'm grateful for\n";

    entries.forEach(function(entry) {

        csv += `"${entry.date}","${entry.mood}","${entry.day.replace(/"/g, '""')}","${entry.win.replace(/"/g, '""')}","${entry.grateful.replace(/"/g, '""')}"\n`;

    });

 const BOM = "\uFEFF";

const blob = new Blob([BOM + csv], {
    type: "text/csv;charset=utf-8;"
});

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Dear_Diary_Entries.csv";

    link.click();

    URL.revokeObjectURL(url);
}