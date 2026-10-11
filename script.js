
/* ========================================
   DEAR DIARY
   Journal, Reading Corner & Reading Journey
======================================== */


/* ========================================
   JOURNAL
======================================== */

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
        smile: textareas[1].value,
        rant: textareas[2].value,
        mind: textareas[3].value
    };

    let entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

    entries.push(entry);

    localStorage.setItem("diaryEntries", JSON.stringify(entries));

    document.querySelector(".journal-card").style.display = "none";
    document.querySelector(".closing-card").style.display = "block";
}


function showEntries() {
    const savedEntries = localStorage.getItem("diaryEntries");

    if (!savedEntries || JSON.parse(savedEntries).length === 0) {
        alert("You don't have any saved entries yet 🩵");
        return;
    }

    const entries = JSON.parse(savedEntries);
    let message = "📖 Your Diary Entries\n\n";

    entries.slice().reverse().forEach(function(entry, index) {
        message += "Entry " + (index + 1) + "\n";
        message += "Date: " + (entry.date || "") + "\n";
        message += "Mood: " + (entry.mood || "") + "\n\n";

        message += "How was your day?\n";
        message += (entry.day || "") + "\n\n";

        message += "What made you smile today?\n";
        message += (entry.smile || entry.win || "") + "\n\n";

        message += "What do you want to rant about?\n";
        message += (entry.rant || entry.grateful || "") + "\n\n";

        message += "What's taking up space in your mind?\n";
        message += (entry.mind || "") + "\n";

        message += "\n----------------------\n\n";
    });

    alert(message);
}


function goHome() {
    document.querySelector(".welcome-card").style.display = "block";
    document.querySelector(".journal-card").style.display = "none";
    document.querySelector(".closing-card").style.display = "none";
    document.querySelector(".entries-card").style.display = "none";
    document.querySelector(".reading-corner-card").style.display = "none";
    document.querySelector(".reading-journey-card").style.display = "none";
}


function downloadEntries() {
    const savedEntries = localStorage.getItem("diaryEntries");

    if (!savedEntries || JSON.parse(savedEntries).length === 0) {
        alert("You don't have any saved entries yet 🩵");
        return;
    }

    const entries = JSON.parse(savedEntries);

    let csv = "Date,Mood,How was your day?,What made you smile today?,What do you want to rant about?,What's taking up space in your mind?\n";

    function escapeCSV(value) {
        return '"' + String(value || "").replace(/"/g, '""') + '"';
    }

    entries.forEach(function(entry) {
        csv += [
            entry.date,
            entry.mood,
            entry.day,
            entry.smile || entry.win,
            entry.rant || entry.grateful,
            entry.mind
        ].map(escapeCSV).join(",") + "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Dear_Diary_Entries.csv";
    link.click();

    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 1000);
}


/* ========================================
   READING CORNER
======================================== */

function openReadingCorner() {
    document.querySelector(".welcome-card").style.display = "none";
    document.querySelector(".journal-card").style.display = "none";
    document.querySelector(".closing-card").style.display = "none";
    document.querySelector(".entries-card").style.display = "none";
    document.querySelector(".reading-journey-card").style.display = "none";
    document.querySelector(".reading-corner-card").style.display = "block";

    const layout = document.querySelector(".reading-library-layout");
    const collections = document.querySelector(".book-collections");
    const bookshelf = document.querySelector(".bookshelf-placeholder");
    const details = document.getElementById("bookCollectionDetails");

    // Restore the side-by-side library layout.
    if (layout) layout.style.display = "grid";
    if (collections) collections.style.display = "flex";
    if (bookshelf) bookshelf.style.display = "flex";

    // Close any previously opened collection.
    if (details) {
        details.style.display = "none";
        details.dataset.status = "";
    }

    document.querySelector(".add-book-section").style.display = "block";

    renderReadingCornerBooks();
}


function showAddBookForm() {
    document.getElementById("addBookForm").style.display = "block";
    document.getElementById("bookTitle").focus();
}


function hideAddBookForm() {
    document.getElementById("addBookForm").style.display = "none";
}


function getReadingCornerBooks() {
    return JSON.parse(localStorage.getItem("readingCornerBooks") || "[]");
}


function saveBook() {
    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const status = document.getElementById("bookStatus").value;

    if (!title) {
        alert("Please enter the book title. 📚");
        return;
    }

    const books = getReadingCornerBooks();

    books.push({
        id: Date.now().toString(),
        title: title,
        author: author,
        status: status,
        dateAdded: new Date().toLocaleDateString("en-IN")
    });

    localStorage.setItem("readingCornerBooks", JSON.stringify(books));

    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookStatus").value = "Want to Read";

    hideAddBookForm();
    renderReadingCornerBooks();

    alert("Your book has been added! 🩵");
}


function changeBookStatus(bookId, newStatus) {
    const books = getReadingCornerBooks();

    const updatedBooks = books.map(function(book) {
        if (book.id === bookId) {
            book.status = newStatus;
        }

        return book;
    });

    localStorage.setItem("readingCornerBooks", JSON.stringify(updatedBooks));

    renderReadingCornerBooks();
    updateReadingJourney();
}


function renderReadingCornerBooks() {
    const books = getReadingCornerBooks();

    const collections = [
        { status: "Want to Read", countId: "wantToReadCount" },
        { status: "Currently Reading", countId: "currentlyReadingCount" },
        { status: "Finished", countId: "finishedCount" }
    ];

    // Update the three collection counts.
    collections.forEach(function(collection) {
        const count = books.filter(function(book) {
            return book.status === collection.status;
        }).length;

        const countElement = document.getElementById(collection.countId);

        if (countElement) {
            countElement.textContent =
                count + (count === 1 ? " book" : " books");
        }
    });

    // Keep the bookshelf visible whenever the main library is displayed.
    const layout = document.querySelector(".reading-library-layout");
    const emptyShelf = document.querySelector(".bookshelf-placeholder");

    if (layout && layout.style.display !== "none" && emptyShelf) {
        emptyShelf.style.display = "flex";
    }

    // If a collection is open, refresh its contents.
    const details = document.getElementById("bookCollectionDetails");

    if (details && details.dataset.status && details.style.display !== "none") {
        showBookCollection(details.dataset.status);
    }

    updateReadingJourney();
}


function openBookCollection(status) {
    showBookCollection(status);
}


function showBookCollection(status) {
    const books = getReadingCornerBooks().filter(function(book) {
        return book.status === status;
    });

    const details = document.getElementById("bookCollectionDetails");
    const heading = document.getElementById("collectionHeading");
    const list = document.getElementById("collectionBookList");

    details.dataset.status = status;
    details.style.display = "block";

    // Hide the entire side-by-side layout while viewing a collection.
    document.querySelector(".reading-library-layout").style.display = "none";
    document.querySelector(".add-book-section").style.display = "none";

    heading.textContent = status;
    list.replaceChildren();

    if (books.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent =
            "No books here yet. Your next story awaits! 🌷";

        list.appendChild(emptyMessage);
    }

    books.forEach(function(book) {
        const card = document.createElement("div");
        card.className = "saved-book";

        const title = document.createElement("strong");
        title.textContent = "📖 " + book.title;
        card.appendChild(title);

        if (book.author) {
            const author = document.createElement("p");
            author.textContent = "by " + book.author;
            card.appendChild(author);
        }

        const date = document.createElement("p");
        date.textContent = "Added: " + (book.dateAdded || "");
        card.appendChild(date);

        const label = document.createElement("label");
        label.textContent = "Reading status";
        label.className = "saved-book-label";
        card.appendChild(label);

        const select = document.createElement("select");

        ["Want to Read", "Currently Reading", "Finished"].forEach(
            function(optionStatus) {
                const option = document.createElement("option");

                option.value = optionStatus;
                option.textContent = optionStatus;

                select.appendChild(option);
            }
        );

        select.value = book.status;

        select.addEventListener("change", function() {
            changeBookStatus(book.id, select.value);
        });

        card.appendChild(select);
        list.appendChild(card);
    });
}


function closeBookCollection() {
    const details = document.getElementById("bookCollectionDetails");

    details.style.display = "none";
    details.dataset.status = "";

    // Restore the side-by-side layout.
    document.querySelector(".reading-library-layout").style.display = "grid";
    document.querySelector(".book-collections").style.display = "flex";
    document.querySelector(".bookshelf-placeholder").style.display = "flex";
    document.querySelector(".add-book-section").style.display = "block";

    renderReadingCornerBooks();
}


/* ========================================
   READING JOURNEY
======================================== */

function openReadingJourney() {
    document.querySelector(".welcome-card").style.display = "none";
    document.querySelector(".journal-card").style.display = "none";
    document.querySelector(".closing-card").style.display = "none";
    document.querySelector(".entries-card").style.display = "none";
    document.querySelector(".reading-corner-card").style.display = "none";
    document.querySelector(".reading-journey-card").style.display = "block";

    updateReadingJourney();
}


function closeReadingJourney() {
    document.querySelector(".reading-journey-card").style.display = "none";
    document.querySelector(".welcome-card").style.display = "none";
    document.querySelector(".journal-card").style.display = "none";
    document.querySelector(".entries-card").style.display = "none";
    document.querySelector(".closing-card").style.display = "none";
    document.querySelector(".reading-corner-card").style.display = "block";

    const layout = document.querySelector(".reading-library-layout");
    const collections = document.querySelector(".book-collections");
    const bookshelf = document.querySelector(".bookshelf-placeholder");
    const details = document.getElementById("bookCollectionDetails");

    // Return to the main library rather than an old collection.
    if (layout) layout.style.display = "grid";
    if (collections) collections.style.display = "flex";
    if (bookshelf) bookshelf.style.display = "flex";

    if (details) {
        details.style.display = "none";
        details.dataset.status = "";
    }

    document.querySelector(".add-book-section").style.display = "block";

    renderReadingCornerBooks();
}


/* ========================================
   READING MILESTONES
======================================== */

const readingMilestones = [1, 5, 10, 25];


function getCelebratedMilestones() {
    return JSON.parse(
        localStorage.getItem("celebratedReadingMilestones") || "[]"
    );
}


function updateReadingJourney() {
    const journeyCard = document.querySelector(".reading-journey-card");

    if (!journeyCard) return;

    const books = getReadingCornerBooks();

    const finishedCount = books.filter(function(book) {
        return book.status === "Finished";
    }).length;

    const countElement = document.getElementById("journeyFinishedCount");

    if (countElement) {
        countElement.textContent = finishedCount;
    }

    let celebrated = getCelebratedMilestones();

    document.querySelectorAll(".milestone").forEach(function(milestone) {
        const target = Number(milestone.dataset.milestone);
        const status = milestone.querySelector(".milestone-status");
        const unlocked = finishedCount >= target;
        const alreadyCelebrated = celebrated.includes(target);

        milestone.classList.toggle("unlocked", unlocked);

        if (status) {
            if (unlocked) {
                status.textContent = alreadyCelebrated
                    ? "✨ Achieved"
                    : "🔓 Unlocked";
            } else {
                status.textContent = "🔒 Locked";
            }
        }
    });

    // Celebrate one newly reached milestone at a time.
    const newlyUnlocked = readingMilestones.find(function(target) {
        return finishedCount >= target && !celebrated.includes(target);
    });

    if (newlyUnlocked) {
        celebrated.push(newlyUnlocked);

        localStorage.setItem(
            "celebratedReadingMilestones",
            JSON.stringify(celebrated)
        );

        const messages = {
            1: "🌱 Your first finished book! Your reading journey has begun!",
            5: "🌼 Five books finished! Look at you go!",
            10: "🌻 Ten books! You're building a beautiful reading habit!",
            25: "🌳 Twenty-five books! What an amazing journey!"
        };

        alert(messages[newlyUnlocked]);

        updateReadingJourney();
    }
}


/* ========================================
   INITIALIZE READING COUNTS
======================================== */

renderReadingCornerBooks();
