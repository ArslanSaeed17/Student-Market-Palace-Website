// music.js — all the content & logic lives here

const message = "Are you bored? 😴 Don't worry, we have a song for you!";

const song = {
  title: "🎵 Click to Watch(BTW MY FAV🫠",
  url: "https://www.youtube.com/watch?v=yk8w6vOW2BQ&list=RDgxu7Wb8meSE&index=3",
  description: "A classic banger — you won't regret it!"
};

function createBanner() {
  const section = document.getElementById("music-section");

  // Message paragraph
  const p = document.createElement("p");
  p.textContent = message;
  p.className = "bored-msg";

  // Hyperlink
  const a = document.createElement("a");
  a.href = song.url;
  a.textContent = song.title;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "watch-link";

  // Description
  const desc = document.createElement("p");
  desc.textContent = song.description;
  desc.className = "song-desc";

  section.appendChild(p);
  section.appendChild(a);
  section.appendChild(desc);
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", createBanner);
