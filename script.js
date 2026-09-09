/*
 * Replace this value with the Web App URL copied from your Google Apps Script deployment.
 * Example: https://script.google.com/macros/s/AKfycb.../exec
 */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydSZfEyBhAP24hdPyWkDiFRkG-IeBYD6zcitnci8Ru1WmXIWruEpketYirrbYOtWo/exec";

const form = document.querySelector("#registration-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector('button[type="submit"]');
const interestInputs = [...document.querySelectorAll('input[name="interests"]')];
const interestCount = document.querySelector("#interest-count");
const registrationDate = document.querySelector("#registrationDate");

// This is shown to the visitor and is also saved in the spreadsheet.
registrationDate.value = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());

function selectedInterests() {
  return interestInputs.filter((input) => input.checked);
}

function updateInterestControls() {
  const selected = selectedInterests();
  const limitReached = selected.length >= 3;

  interestCount.textContent = `${selected.length} / 3 selected`;
  interestInputs.forEach((input) => {
    input.disabled = limitReached && !input.checked;
  });
}

interestInputs.forEach((input) => input.addEventListener("change", updateInterestControls));
updateInterestControls();

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

function formValue(name) {
  return form.elements[name].value.trim();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");

  if (!form.checkValidity()) {
    form.reportValidity();
    setMessage("Please complete all required fields before registering.");
    return;
  }

  const interests = selectedInterests().map((input) => input.value);
  if (interests.length > 3) {
    setMessage("Please select no more than three areas of interest.");
    return;
  }

  if (SCRIPT_URL === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
    setMessage("This form still needs its Google Apps Script Web App URL. See the README to connect it.");
    return;
  }

  const payload = {
    fullName: formValue("fullName"),
    email: formValue("email"),
    phone: formValue("phone"),
    country: formValue("country"),
    university: formValue("university"),
    fieldOfStudy: formValue("fieldOfStudy"),
    yearOfStudy: form.elements.yearOfStudy.value,
    eventType: form.elements.eventType.value,
    interests: interests.join(", "),
    participationFormat: form.elements.participationFormat.value,
    learningExpectations: formValue("learningExpectations"),
    programmingExperience: form.elements.programmingExperience.value,
    howDidYouHear: form.elements.howDidYouHear.value,
    termsAccepted: form.elements.termsAccepted.checked ? "Yes" : "No",
    registrationDate: registrationDate.value,
  };

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Submitting…";

  try {
    /*
     * Apps Script web apps do not reliably support CORS preflight requests.
     * Sending a JSON body as text/plain avoids preflight while preserving JSON data.
     * no-cors intentionally returns an opaque response, so a completed request is treated as submitted.
     */
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    form.reset();
    registrationDate.value = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    updateInterestControls();
    setMessage("You’re registered! We’ll be in touch with TechFest 2027 updates.", "success");
  } catch (error) {
    console.error("Registration failed:", error);
    setMessage("We couldn’t submit your registration. Please check your connection and try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Complete registration";
  }
});
