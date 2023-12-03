const form = document.querySelector("form button");

form.addEventListener("click", validateForm);

// ------------------------------------------

function validateForm(event) {
  event.preventDefault();

  const fullName = document.querySelector("#input-name");
  const nameError = document.querySelector("#name-error");

  const email = document.querySelector("#input-email");
  const emailError = document.querySelector("#email-error");

  const subject = document.querySelector("#input-subject");
  const subjectError = document.querySelector("#subject-error");

  const message = document.querySelector("#input-message");
  const messageError = document.querySelector("#message-error");

  const isFormValid = document.querySelector("dialog");

  const isNameValid = fullName.value.length > 0;
  if (isNameValid) {
    nameError.style.display = "none";
  } else {
    nameError.style.display = "block";
  }

  const isSubjectValid = subject.value.length > 0;
  if (isSubjectValid) {
    subjectError.style.display = "none";
  } else {
    subjectError.style.display = "block";
  }

  const isEmailValid = email.value.length > 0 && validateEmail(email.value);
  if (isEmailValid) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }

  const isMessageValid = message.value.length >= 10;
  if (isMessageValid) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
  }

  if (isMessageValid && isEmailValid) {
    isFormValid.style.display = "block";
    document.querySelector("form").reset();
  } else {
    isFormValid.style.display = "none";
  }

  if (isNameValid && isSubjectValid && isEmailValid && isMessageValid) {
    isFormValid.showModal();
  } else {
    isFormValid.style.display = "none";
  }
}

// ------------------------------------------

function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patterMatches = regEx.test(email);
  return patterMatches;
}
