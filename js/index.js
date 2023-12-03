import { settings } from "./settings.js";
import { displayElement } from "./shared.js";

// Utilities functions
function displaySpinner(visible) {
  displayElement(visible, "#loader", "block");
}

function displayBtn(visible) {
  displayElement(visible, "#box-cta", "flex");
}

function displayError(visible) {
  displayElement(visible, "#error", "block");
}

let posts = [];
let slideshowPosition = 0;
let postNumber = 4;

// Add event listeners for desktop interaction
const btnPrev = document.querySelector("#backward-arrow");
btnPrev.addEventListener("click", previousSlide);

const btnNext = document.querySelector("#forward-arrow");
btnNext.addEventListener("click", nextSlide);

// Add event listeners for mobile interaction
const btnNextMobile = document.querySelector("#forward-arrow-mobile");
btnNextMobile.addEventListener("click", nextSlideMobile);
const btnPrevMobile = document.querySelector("#backward-arrow-mobile");
btnPrevMobile.addEventListener("click", prevSlideMobile);

// Slide images  according to the desktop button clicks
function nextSlide() {
  slideshowPosition += 4;
  if (slideshowPosition > 8) {
    slideshowPosition = 0;
  }

  updatePosts(posts);
}

function previousSlide() {
  slideshowPosition -= 4;
  if (slideshowPosition < 0) {
    slideshowPosition = 8;
  }

  updatePosts(posts);
}

// Slide images  according to the mobile button clicks
function nextSlideMobile() {
  slideshowPosition += 1;
  if (slideshowPosition > 11) {
    slideshowPosition = 0;
  }

  updatePosts(posts);
}

function prevSlideMobile() {
  slideshowPosition -= 1;
  if (slideshowPosition < 0) {
    slideshowPosition = 11;
  }

  updatePosts(posts);
}

// Call these functions to get API
async function displayPosts() {
  try {
    displaySpinner(true);
    displayBtn(false);
    displayError(false);

    const url = new URL(`${settings.wp_baseurl}/wp-json/wp/v2/posts`);
    url.searchParams.append("context", "embed");
    url.searchParams.append("orderby", "date");
    url.searchParams.append("order", "desc");
    url.searchParams.append("per_page", "12");
    url.searchParams.append("page", "1");
    url.searchParams.append(
      "_fields",
      "id,date,slug,title,link,excerpt.rendered,_links,_embedded,yoast_head_json.description"
    );
    url.searchParams.append("_embed", "wp:featuredmedia");

    const response = await fetch(url);
    const data = await response.json();

    posts = data;

    displayBtn(true);
    updatePosts(data);
  } catch (e) {
    displayError(true);
    displaySpinner(false);
    displayBtn(true);
  } finally {
    displaySpinner(false);
  }
}

// Call function to update post after the Rest API fetch
function updatePosts(data) {
  const carousel = document.querySelector("#items");
  carousel.innerHTML = "";

  for (let i = slideshowPosition; i < slideshowPosition + postNumber && i <= 11; i++) {
    const item = data[i];

    const template = document.querySelector("#post");
    const post = template.content.cloneNode(true);

    post.querySelector("img").src = item._embedded["wp:featuredmedia"][0].media_details.sizes.large.source_url;
    post.querySelector("img").alt = item._embedded["wp:featuredmedia"][0].alt_text;

    let title = item.title.rendered;
    post.querySelector("h2").innerText = title;

    const links = post.querySelectorAll("a");
    for (let ia = 0; ia < links.length; ia++) {
      const link = links[ia];
      link.href = "post.html?id=" + item.id;
    }

    carousel.appendChild(post);
  }
}

displayPosts();
