// Get Api Data

let phoneNimberIsverfied = false;

function checkValidation() {
  let CustomerName = getElemnt("cName").value;
  let CustomerMobile = getElemnt("phone")
    .value.replace("+", "")
    .trim()
    .replace(" ", "");
  let Website = "Toyota";
  let AppointmentDateTime = getElemnt("appointmentDate").value;
  let CenterID = +getElemnt("serviceCenter").value;
  let ServiceID = +getElemnt("serviceType").value;
  let ModelID = +getElemnt("model").value;
  let data = {
    CustomerName,
    CustomerMobile,
    Website,
    AppointmentDateTime,
    CenterID,
    ServiceID,
    ModelID,
  };

  for (let i = 0; i < Object.keys(data).length; i++) {
    const element = data[Object.keys(data)[i]];
    if (!element) {
      $("submit").classList.remove("btn-primary");
      $("submit").classList.add("btn-secondary");
      return false;
    }
  }
  $("submit").classList.remove("btn-secondary");
  $("submit").classList.add("btn-primary");
  return true;
}

function checkAll() {
  let hasOneError = false;
  for (let i = 0; i < Object.keys(formElements).length; i++) {
    let key = Object.keys(formElements)[i];
    const element = $(`${formElements[key].name}_feadback`);
    if (!element.innerHTML) {
      validation(formElements[key].name);
      hasOneError = true;
    }
  }

  return !hasOneError;
}

function validation(name) {
  let value = $(name).value;
  let feadback = $(`${name}_feadback`);
  switch (name) {
    case "email":
      if (!Regex.mail.test(value)) {
        feadback.textContent = "Email is not valid";
      } else {
        feadback.textContent = "";
      }
      break;
    case "client-name":
      if (value) {
        feadback.textContent = "";
      } else {
        feadback.textContent = "Required!";
      }
      break;
    case "service-center":
      if (value) {
        feadback.textContent = "";
      } else {
        feadback.textContent = "Required!";
      }
      break;
    case "appointment-date":
      if (value) {
        feadback.textContent = "";
      } else {
        feadback.textContent = "Required!";
      }
      break;
    case "model":
      if (value) {
        feadback.textContent = "";
      } else {
        feadback.textContent = "Required!";
      }
      break;
    case "service-type":
      if (value) {
        feadback.textContent = "";
      } else {
        feadback.textContent = "Required!";
      }
      break;
    case "phone":
      if (value.length < 5) {
        feadback.textContent = "Required!";
      } else {
        feadback.textContent = "";
      }
      break;

    default:
      break;
  }
}

function checkAndValide(name) {
  validation(name);
  checkValidation();
}

$("submit").addEventListener("click", (e) => {
  e.preventDefault();
  let CustomerName = getElemnt("cName").value;
  let CustomerMobile = getElemnt("phone")
    .value.replace("+", "")
    .trim()
    .replace(" ", "");
  let CustomerEmail = getElemnt("email").value;
  let Website = "Toyota";
  let AppointmentDateTime = getElemnt("appointmentDate").value;
  let CenterID = +getElemnt("serviceCenter").value;
  let ServiceID = +getElemnt("serviceType").value;
  let ModelID = +getElemnt("model").value;
  let Comments = getElemnt("description").value;

  if (!$("verify").classList.contains("verfied")) {
    $("phone_feadback").innerHTML = "Please verify your phone number!";
    return false;
  }

  let data = {
    CustomerName,
    CustomerMobile,
    CustomerEmail,
    Website,
    AppointmentDateTime,
    CenterID,
    ServiceID,
    ModelID,
    Comments,
  };

  const formData = new FormData();
  Object.keys(data).forEach((element) => {
    formData.append(element, data[element]);
  });

  fetch(`${baseURL}AddPendingAppointment`, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      alert("success");
    });
});
