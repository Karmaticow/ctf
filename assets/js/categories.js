---
---

const categories = { {% for category in site.categories %}{% capture category_name %}{{ category | first }}{% endcapture %}{{ category_name | replace: " ", "_" }}: [{% for post in site.categories[category_name] %}{ url: `{{ site.baseurl }}{{ post.url }}`, date: `{{post.date | date_to_string}}`, title: `{{post.title}}`},{% endfor %}],{% endfor %} }

console.log(categories)

window.onload = function () {
  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", function (e) {
      const posts = categories[e.target.innerText.replace(" ","_")];
      let html = ``
      posts.forEach(post=>{
        html += `
        <a class="modal-article" href="${post.url}">
          <h4>${post.title}</h4>
          <small class="modal-article-date">${post.date}</small>
        </a>
        `
      })
      document.querySelector("#category-modal-title").innerText = e.target.innerText;
      document.querySelector("#category-modal-content").innerHTML = html;
      document.querySelector("#category-modal-bg").classList.toggle("open");
      document.querySelector("#category-modal").classList.toggle("open");
    });
  });

  document.querySelector("#category-modal-bg").addEventListener("click", function(){
    document.querySelector("#category-modal-title").innerText = "";
    document.querySelector("#category-modal-content").innerHTML = "";
    document.querySelector("#category-modal-bg").classList.toggle("open");
    document.querySelector("#category-modal").classList.toggle("open");
  })
  const chips = document.querySelectorAll(".filter-chip");
  const getArticles = () =>
    Array.from(document.querySelectorAll(".articles .article"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const activeFilters = Array.from(chips)
        .filter((c) => c.classList.contains("active"))
        .map((c) => c.dataset.tag);
      getArticles().forEach((article) => {
        const tags = article.dataset.tags
          ? article.dataset.tags.split(",")
          : [];
        if (
          activeFilters.length === 0 ||
          activeFilters.every((tag) => tags.includes(tag))
        ) {
          article.style.display = "";
        } else {
          article.style.display = "none";
        }
      });
    });
  });

  const sortSelect = document.querySelector("#sort-order");
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      const direction = event.target.value;
      const section = document.querySelector(".articles");
      const sorted = getArticles().sort((a, b) => {
        const orderA = parseInt(a.dataset.order || "0", 10);
        const orderB = parseInt(b.dataset.order || "0", 10);
        if (orderA !== orderB) {
          return direction === "asc" ? orderA - orderB : orderB - orderA;
        }
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      });
      sorted.forEach((article) => section.appendChild(article));
    });
  }
};
