import { settings } from "./settings.js";
import { displayElement } from "./shared.js";

function displaySpinner(visible) {
  displayElement(visible, "#loader", "block");
}

function displayError(visible) {
  displayElement(visible, "#error", "block");
}

function displayViewMore(visible) {
  displayElement(visible, "#view-more", "flex");
}

// ------------------------------------------

let posts = [];
let currentPage = 1;

document.querySelector("#posts").innerHTML = "";

document.querySelector("button").addEventListener("click", nextPage);

function nextPage() {
  currentPage += 1;

  fetchCurrentPagePosts(currentPage);
}

// ------------------------------------------

async function fetchCurrentPagePosts(currentPage) {
  try {
    displayViewMore(false);
    displaySpinner(true);
    displayError(false);

    const url = new URL(`${settings.wp_baseurl}/wp-json/wp/v2/posts`);
    url.searchParams.append("context", "embed");
    url.searchParams.append("orderby", "date");
    url.searchParams.append("order", "desc");
    url.searchParams.append("per_page", "10");
    url.searchParams.append("page", `${currentPage}`);
    url.searchParams.append(
      "_fields",
      "id,date,slug,title,link,excerpt.rendered,_links,_embedded,yoast_head_json.description,yoast_head_json.author.name"
    );
    url.searchParams.append("_embed", "author,wp:featuredmedia");

    const response = await fetch(url);

    if (response.status === 200) {
      const data = await response.json();

      posts = data;

      appendPosts(data);

      displayViewMore(true);
    } else {
      displayViewMore(false);
    }
  } catch (e) {
    displayError(true);
  } finally {
    displaySpinner(false);
  }
}

// ------------------------------------------

function appendPosts(data) {
  const posts = document.querySelector("#posts");

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    const template = document.querySelector("#post");
    const post = template.content.cloneNode(true);

    post.querySelector("img").src = item._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
    post.querySelector("img").alt = item._embedded["wp:featuredmedia"][0].alt_text;

    let title = item.title.rendered;
    post.querySelector("h2").innerText = title;

    post.querySelector("span").innerText = item.yoast_head_json.author;
    post.querySelector(".card-content>p").innerHTML = item.yoast_head_json.description;

    const links = post.querySelectorAll("a");
    for (let ia = 0; ia < links.length; ia++) {
      const link = links[ia];
      link.href = "post.html?id=" + item.id;
    }

    const newDate = new Date(item.date);
    let text = newDate.toLocaleDateString();
    post.querySelector("#date").innerText = text;

    posts.appendChild(post);
  }
}

fetchCurrentPagePosts(currentPage);
