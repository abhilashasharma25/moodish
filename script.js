let journalEntries = JSON.parse(localStorage.getItem('entries')) || [];

function updateEntries() {
    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = ''; // Clear existing entries

    journalEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.classList.add('entry', entry.sentiment);
        
        li.innerHTML = `
            <p id="entry-text-${index}">${entry.text}</p>
            <p class="sentiment">${entry.sentiment.toUpperCase()} mood</p>
            <p><small>${entry.timestamp}</small></p>
            <button class="edit-button" onclick="editEntry(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Delete</button>
        `;
        
        entriesList.appendChild(li);
    });
}

function addEntry() {
    const entryText = document.getElementById('journal-entry').value.trim();
    if (entryText) {
        const sentiment = analyzeSentiment(entryText);
        const timestamp = new Date().toLocaleString();

        const newEntry = {
            text: entryText,
            sentiment: sentiment,
            timestamp: timestamp,
        };

        journalEntries.push(newEntry);
        localStorage.setItem('entries', JSON.stringify(journalEntries));

        document.getElementById('journal-entry').value = ''; // Clear textarea
        updateEntries();
    }
}

function deleteEntry(index) {
    journalEntries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(journalEntries));
    updateEntries();
}

function editEntry(index) {
    const entryText = document.getElementById(`entry-text-${index}`).textContent;
    const newText = prompt("Edit your journal entry:", entryText);

    if (newText !== null && newText.trim() !== "") {
        journalEntries[index].text = newText;
        journalEntries[index].sentiment = analyzeSentiment(newText); // Re-analyze sentiment
        journalEntries[index].timestamp = new Date().toLocaleString(); // Update timestamp
        localStorage.setItem('entries', JSON.stringify(journalEntries));
        updateEntries();
    }
}

// Simple sentiment analysis function
function analyzeSentiment(text) {
    const positiveKeywords = ['happy', 'great', 'awesome', 'excited', 'love'];
    const negativeKeywords = ['sad', 'stressed', 'angry', 'overwhelmed', 'hate'];

    const positive = positiveKeywords.some(keyword => text.includes(keyword));
    const negative = negativeKeywords.some(keyword => text.includes(keyword));

    if (positive) return 'positive';
    if (negative) return 'negative';
    return 'neutral';
}

updateEntries(); // Initialize journal entries on page load
