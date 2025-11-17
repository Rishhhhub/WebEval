document.addEventListener("DOMContentLoaded", () => {
  const notesSection = document.querySelector(".notes-section");
  const paginationContainer = document.querySelector(".pagination");

  // Main function to fetch and render notes for a specific page
  async function fetchAndRenderNotes(page = 1) {
    try {
      // Fetch data for a specific page
      const response = await fetch(`/api/notes?page=${page}`); 
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json();
      renderNotes(data.notes);
      renderPagination(data.totalPages, data.currentPage);

    } catch (error) {
      console.error("Error loading notes:", error);
      notesSection.innerHTML = "<p>⚠️ Failed to load notes data.</p>";
    }
  }

  // Renders just the notes
  function renderNotes(notes) {
    notesSection.innerHTML = ""; // Clear existing notes

    if (notes.length === 0) {
      notesSection.innerHTML = "<p>No notes found on this page.</p>";
      return;
    }

    notes.forEach(note => {
      const noteItem = document.createElement("div");
      noteItem.className = "note-item";
      noteItem.innerHTML = `
        <div class="note-details">
          <div class="category">${escapeHtml(note.category)}</div>
          <div class="title">${escapeHtml(note.title)}</div>
          <div class="meta">${escapeHtml(note.meta)}</div>
          <form action="/api/notes/delete/${note._id}" method="POST" style="margin-top: 10px;" onsubmit="return confirm('Are you sure you want to delete this Note? This action cannot be undone.');">
    <button type="submit" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
        Delete
    </button>
</form>
          </form>
        </div>
        <div class="note-image">
          <img 
            src="${escapeHtml(note.image)}" 
            alt="${escapeHtml(note.title)}" 
            style="width:160px;height:auto;border-radius:8px;">
        </div>
      `;
      notesSection.appendChild(noteItem);
    });
  }

  // Renders the pagination buttons
  function renderPagination(totalPages, currentPage) {
    paginationContainer.innerHTML = ""; // Clear old buttons

    // "Previous" Button
    if (currentPage > 1) {
      const prevButton = document.createElement('a');
      prevButton.href = "#";
      prevButton.className = "arrow";
      prevButton.innerHTML = "«";
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetchAndRenderNotes(currentPage - 1);
      });
      paginationContainer.appendChild(prevButton);
    }

    // Page Number Buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('a');
      pageButton.href = "#";
      pageButton.innerText = i;
      if (i === currentPage) {
        pageButton.className = "active";
      }
      pageButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetchAndRenderNotes(i);
      });
      paginationContainer.appendChild(pageButton);
    }

    // "Next" Button
    if (currentPage < totalPages) {
      const nextButton = document.createElement('a');
      nextButton.href = "#";
      nextButton.className = "arrow";
      nextButton.innerHTML = "»";
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetchAndRenderNotes(currentPage + 1);
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  // Helper function
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Initial load
  fetchAndRenderNotes(1);
});