document.addEventListener("DOMContentLoaded", async () => {

  // Your OOP Class
  class Book {
    constructor({ _id, title, description, coverUrl, author, subject, downloadUrl }) {
      this.id = _id;
      this.title = title;
      this.description = description || "No description available.";
      this.coverUrl = coverUrl || "https://via.placeholder.com/150x220?text=No+Cover";
      this.author = author || "Unknown Author";
      this.subject = subject || "General";
      this.downloadUrl = downloadUrl;
    }

    getCardHTML() {
      return `
        <div class="book-card">
          <div class="book-cover" style="background-image:url('${escapeHtml(this.coverUrl)}')"></div>
          <h3 class="book-title">${escapeHtml(this.title)}</h3>
          <p class="book-description">${escapeHtml(this.description)}</p>
          <p class="book-author"><strong>Author:</strong> ${escapeHtml(this.author)}</p>
          <p class="book-subject"><strong>Subject:</strong> ${escapeHtml(this.subject)}</p>
          
          <div class="button-container" style="display: flex; justify-content: space-around; margin-top: 10px;">
            
            ${this.downloadUrl ? `
              <a href="${escapeHtml(this.downloadUrl)}" target="_blank" 
                 style="background: #2ecc71; color: white; text-decoration: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                Download
              </a>
            ` : ''}

            <form action="/api/books/delete/${this.id}" method="POST" style="margin: 0;" onsubmit="return confirm('Are you sure you want to delete this Book? This action cannot be undone.');">
    <button type="submit" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
        Delete
    </button>
</form>
          </div>
        </div>
      `;
    }
  }

  const grid = document.querySelector(".book-grid .book-grid"); 
  const searchInput = document.querySelector(".search-bar input"); // <-- Select the search box
  let allBooks = []; // <-- Store books here so we can filter them later

  try {
    const response = await fetch("/api/books");
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const bookData = await response.json();
    
    // Convert raw data to Book objects and save to our variable
    allBooks = bookData.map(item => new Book(item));

    // Render everything initially
    renderBooks(allBooks);

  } catch (error) {
    console.error("Error loading books:", error);
    grid.innerHTML = "<p>⚠️ Failed to load books data.</p>";
  }

  // --- RENDER FUNCTION ---
  // Now accepts a specific list of books to render
  function renderBooks(booksToRender) {
    grid.innerHTML = ""; // Clear the grid

    if (booksToRender.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
          <div style="font-size: 60px; margin-bottom: 20px;">🔍</div>
          <h3>No books found</h3>
          <p>We couldn't find any books matching "${document.querySelector(".search-bar input").value}".</p>
          <p>Try searching for "Calculus" or "History".</p>
        </div>
      `;
      return;
    }

    booksToRender.forEach(book => {
      grid.insertAdjacentHTML("beforeend", book.getCardHTML());
    });
  }

  // --- SEARCH EVENT LISTENER ---
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      // Filter the global allBooks array
      const filteredBooks = allBooks.filter(book => {
        return (
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.subject.toLowerCase().includes(searchTerm)
        );
      });

      // Re-render with only the filtered books
      renderBooks(filteredBooks);
    });
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
  // --- AUTO-SEARCH FROM URL ---
  // This checks if we arrived here from the "Subjects" page
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  
  if (searchParam) {
    // 1. Put the term in the search box
    if(searchInput) searchInput.value = searchParam;
    
    // 2. Wait a moment for data to load, then filter
    // We use a small timeout to ensure 'allBooks' has data
    setTimeout(() => {
        const searchTerm = searchParam.toLowerCase();
        const filteredBooks = allBooks.filter(book => {
            return (
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.subject.toLowerCase().includes(searchTerm)
            );
        });
        renderBooks(filteredBooks);
    }, 500); 
  }
});