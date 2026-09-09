/*
 * Google Form endpoint. The form is linked to the TechFest 2027 responses sheet.
 * No API key or Apps Script deployment is required.
 */
const GOOGLE_FORM_RESPONSE_URL =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfwo6a0QYGJtaiCVKjJym00V8jqt7pvoSiUwPPzcXeRUNpkAQ/formResponse";

const GOOGLE_FORM_FIELDS = {
  fullName: "entry.776313849",
  email: "entry.1131887253",
  phone: "entry.626052027",
  country: "entry.311859560",
  university: "entry.1301091224",
  fieldOfStudy: "entry.1601138298",
  yearOfStudy: "entry.624815439",
  eventType: "entry.849132993",
  interests: "entry.1502638778",
  participationFormat: "entry.493187827",
  learningExpectations: "entry.1626917458",
  programmingExperience: "entry.721456402",
  howDidYouHear: "entry.526986907",
  termsAccepted: "entry.902911452",
  registrationDate: "entry.2072632184",
};

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
  if (interests.length === 0) {
    setMessage("Please choose at least one area of interest.");
    return;
  }

  if (interests.length > 3) {
    setMessage("Please select no more than three areas of interest.");
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
     * Google Forms accepts URL-encoded POST data. no-cors keeps this request
     * compatible with GitHub Pages; its response is intentionally opaque.
     */
    const responseData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      responseData.set(GOOGLE_FORM_FIELDS[key], value);
    });

    await fetch(GOOGLE_FORM_RESPONSE_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: responseData.toString(),
    });

    form.reset();
    registrationDate.value = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    updateInterestControls();
    setMessage("Your registration request was sent. We’ll be in touch with TechFest 2027 updates.", "success");
  } catch (error) {
    console.error("Registration failed:", error);
    setMessage("We couldn’t submit your registration. Please check your connection and try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Complete registration";
  }
});
