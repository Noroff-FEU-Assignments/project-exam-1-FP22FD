import { settings } from "./settings.js";
import { displayElement } from "./shared.js";

function displaySpinner(visible) {
  displayElement(visible, "#loader", "block");
}

function displayError(visible) {
  displayElement(visible, "#error", "block");
}

// ------------------------------------------

document.body.onclick = () => {
  document.querySelector("dialog").close();
};

document.querySelector("dialog img").addEventListener("click", function (event) {
  event.stopPropagation();
});

document.querySelector("article img").addEventListener("click", function (event) {
  event.stopPropagation();

  document.querySelector("dialog img").src = data.yoast_head_json.og_image[0].url;

  document.querySelector("dialog").showModal();
});

// ------------------------------------------

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
console.log(id);

let data = undefined;

async function displayPost(id) {
  try {
    displaySpinner(true);
    displayError(false);

    const url = `${settings.wp_baseurl}/wp-json/wp/v2/posts/${id}`;

    const response = await fetch(url);
    data = await response.json();
    console.log("data", data);

    const article = document.querySelector("article");

    article.querySelector("img").src = data.yoast_head_json.og_image[0].url;
    article.querySelector("img").alt = data.title.rendered;
    article.querySelector("figcaption").innerHTML = data.title.rendered;

    const title = document.querySelector("#title");
    const postTitle = data.title.rendered;
    title.querySelector("h1").innerHTML = postTitle;
    document.title = `Amigume | ${postTitle}`;

    article.querySelector("#post-content").innerHTML = data.content.rendered;
  } catch (e) {
    displayError(true);
    displaySpinner(false);
  } finally {
    displaySpinner(false);
  }
}

displayPost(id);
