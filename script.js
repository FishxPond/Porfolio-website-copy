function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


if (document.getElementById("thumbnails")) {
  const featuredEl = document.getElementById("featured");
  const thumbnailsEl = document.getElementById("thumbnails");
  const searchBar = document.getElementById("searchBar");
  const filterButtons = document.querySelectorAll(".filter");

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function renderHomepage(filteredList = artPieces) {
    const shuffled = shuffle([...filteredList]); // clone so original not mutated
    const [featured, ...rest] = shuffled;

    if (featured) {
      featuredEl.innerHTML = `
        <div class="thumbnail" onclick="location.href='media.html?id=${featured.id}'">
          <img src="${featured.src}" alt="${featured.title}" />
          <p>${featured.title}</p>
        </div>
      `;
    }

    thumbnailsEl.innerHTML = "";
    rest.forEach((piece) => {
      const thumb = document.createElement("div");
      thumb.className = "thumbnail";
      thumb.onclick = () => (window.location.href = `media.html?id=${piece.id}`);
      thumb.innerHTML = `
        <img src="${piece.src}" alt="${piece.title}" />
        <p>${piece.title}</p>
      `;
      thumbnailsEl.appendChild(thumb);
    });
  }

  renderHomepage();

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const type = btn.getAttribute("data-type");
      const filtered = type === "all" ? artPieces : artPieces.filter((p) => p.type === type);
      renderHomepage(filtered);
    });
  });

  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = artPieces.filter((p) => p.title.toLowerCase().includes(query));
    renderHomepage(filtered);
  });
}

if (document.getElementById("artDisplay")) {
  const id = getQueryParam("id");
  const art = artPieces.find((p) => p.id === id);

  const artDisplay = document.getElementById("artDisplay");
  const artTitle = document.getElementById("artTitle");
  const artMeta = document.getElementById("artMeta");
  const artDescription = document.getElementById("artDescription");
  const commentForm = document.getElementById("commentForm");
  const commentInput = document.getElementById("commentInput");
  const commentList = document.getElementById("commentList");
  const sidebar = document.getElementById("sidebarThumbnails");
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = encodeURIComponent(e.target.value.trim());
      if (query) {
        window.location.href = `search.html?query=${query}`;
      }
    }
  });

  if (art) {
    if (art.type === "image") {
      artDisplay.innerHTML = `
        <img src="${art.src}" alt="${art.title}" style="width:100%;height:auto;aspect-ratio:4/3;" />
      `;
    } else {
      artDisplay.innerHTML = `
        <video controls style="width:100%;height:auto;aspect-ratio:4/3;">
          <source src="${art.src}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;
    }

    artTitle.textContent = art.title;
    artMeta.textContent = `${art.views} views • ${art.likes} likes`;
    artDescription.textContent = art.description;

    function renderComments() {
      commentList.innerHTML = "";
      art.comments.forEach((comment) => {
        const li = document.createElement("li");
        li.className = "comment";
        li.innerHTML = `
          <div class="avatar" style="background:${comment.avatarColor}"></div>
          <div class="content">
            <div class="username">${comment.username}</div>
            <div>${comment.text}</div>
          </div>
        `;
        commentList.appendChild(li);
      });
    }

    renderComments();

    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userComment = commentInput.value.trim();
      if (userComment) {
        const newComment = {
          username: "You",
          avatarColor: "#8ecae6",
          text: userComment
        };
        art.comments.unshift(newComment);
        renderComments();
        commentInput.value = "";
      }
    });

    const otherArt = artPieces.filter((p) => p.id !== id);
    const selected = otherArt.sort(() => 0.5 - Math.random()).slice(0, 5);

    selected.forEach((p) => {
      const div = document.createElement("div");
      div.className = "thumbnail";
      div.onclick = () => (window.location.href = `media.html?id=${p.id}`);
      div.innerHTML = `
        <img src="${p.src}" alt="${p.title}" />
        <p>${p.title}</p>
      `;
      sidebar.appendChild(div);
    });
  }
}

