document.addEventListener("DOMContentLoaded", async () => {
  const courseList = document.querySelector(".course-list");

  try {
    // Fetch from your new API route
    const response = await fetch("/api/courses"); 
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const courses = await response.json();
    renderCourses(courses);
  } catch (error) { // <-- ADDED THE OPENING {
    console.error("Error loading courses:", error); // Changed notes.json to courses
    courseList.innerHTML = "<p>⚠️ Failed to load courses data.</p>";
  } // <-- ADDED THE CLOSING }

  function renderCourses(courses) {
    courseList.innerHTML = "";

    courses.forEach(course => {
      const courseItem = document.createElement("div");
      courseItem.className = "course-item";

      courseItem.innerHTML = `
        <div class="course-info">
          <div class="type">${escapeHtml(course.type)}</div>
          <h3>${escapeHtml(course.title)}</h3>
          <p>${escapeHtml(course.description)}</p>
          
          <div style="display: flex; gap: 10px; align-items: center;">
              <a href="#" class="enroll-button" onclick="showEnrollToast(event, '${escapeHtml(course.title)}')">Enroll Now</a>

              <form action="/api/courses/delete/${course._id}" method="POST" style="margin: 0;" onsubmit="return confirm('Are you sure you want to delete this Course?');">
                <button type="submit" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; cursor: pointer;">
                  Delete
                </button>
              </form>
          </div>

        </div>
        <div class="course-image">
          <img 
            src="${escapeHtml(course.image)}" 
            alt="${escapeHtml(course.title)}" 
            style="width:100%;height:auto;border-radius:8px;">
        </div>
      `;

      courseList.appendChild(courseItem);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
});
function showEnrollToast(e, courseTitle) {
  e.preventDefault(); // Stop the link from jumping to top
  
  // Reuse the toast logic you put in the header
  const toast = document.getElementById("toast-box");
  if(toast) {
    toast.innerText = "Successfully enrolled in " + courseTitle + "!";
    toast.style.backgroundColor = "#2ecc71"; // Green
    toast.style.visibility = "visible";
    toast.style.animation = "fadein 0.5s, fadeout 0.5s 2.5s";
    setTimeout(() => { toast.style.visibility = "hidden"; }, 3000);
  }
}
