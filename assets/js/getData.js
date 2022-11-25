const baseURL = "http://167.86.97.165:86/api/v1/ServiceCenters/";
const spinner = `<div class="spinner-border spinner-border-sm" role="status">
<span class="sr-only">Loading...</span>
</div>`;
// get form elements
let formElements = {
  cName: {
    name: "client-name",
    value: "",
    hasErrors: [],
  },
  phone: {
    name: "phone",
    value: "",
    hasErrors: [],
  },
  email: {
    name: "email",
    value: "",
    hasErrors: [],
  },
  serviceCenter: {
    name: "service-center",
    value: "",
    hasErrors: [],
  },
  appointmentDate: {
    name: "appointment-date",
    value: "",
    hasErrors: [],
  },
  model: {
    name: "model",
    value: "",
    hasErrors: [],
  },
  serviceType: {
    name: "service-type",
    value: "",
    hasErrors: [],
  },
  description: {
    name: "description",
    value: "",
    hasErrors: [],
  },
};

function resetAvailableSlots() {
  $("ctrl-slots").innerHTML = "Show available Slots";
  $("ctrl-slots").setAttribute("class", "");
  $("ctrl-slots").setAttribute("class", "ctrl-slots click");
}

function checkedSlot() {
  if (this.classList.contains("active")) {
    this.classList.remove("active");
  } else {
    this.classList.add("active");
  }
}

const submitForm = $("submit");

const getElemnt = (name) => {
  return $(formElements[name].name);
};
// create service center list
fetch(`${baseURL}GetServiceCenters?websiteName=Toyota`)
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    res.Data.forEach((r) => {
      let el = document.createElement("option");
      el.value = r.ServiceCenterId;
      el.innerHTML = r.ServiceCenterName;
      getElemnt("serviceCenter").appendChild(el);
    });
  });

// create model list
fetch(`${baseURL}GetBrandModels?brand=Toyota`)
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    res.Data.forEach((r) => {
      let el = document.createElement("option");
      el.value = r.ModelID;
      el.innerHTML = r.ModelName;
      getElemnt("model").appendChild(el);
    });
  });

// create service type list
getElemnt("serviceCenter").addEventListener("change", function () {
  resetAvailableSlots();

  fetch(
    `${baseURL}GetServiceOfCenter?CenterId=${this.value}&WebsiteName=Toyota`
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      res.Data.forEach((r) => {
        let el = document.createElement("option");
        el.value = r.ServiceId;
        el.innerHTML = r.ServiceName;
        getElemnt("serviceType").appendChild(el);
      });
    });
});

function handleDate(start, end) {
  resetAvailableSlots();
  let startMS = new Date(`2022-11-24 ${start}`).getTime();
  let endMS = new Date(`2022-11-24 ${end}`).getTime();

  let Times = [];
  if (endMS > startMS) {
    let timeBtw = endMS - startMS;

    let i = 0;
    while (i < timeBtw) {
      let newQuarter = startMS + i;
      let hours = new Date(newQuarter).getHours();
      let mins = new Date(newQuarter).getMinutes();
      let scnds = new Date(newQuarter).getSeconds();

      let newQuarter1 = startMS + (i + 900000);
      let hours1 = new Date(newQuarter1).getHours();
      let mins1 = new Date(newQuarter1).getMinutes();
      let scnds1 = new Date(newQuarter1).getSeconds();

      let session = `
      
      
      ${handleShowNumOfTime(hours)}:${handleShowNumOfTime(
        mins
      )}:${handleShowNumOfTime(scnds)} - ${handleShowNumOfTime(
        hours1
      )}:${handleShowNumOfTime(mins1)}:${handleShowNumOfTime(scnds1)}`;
      Times.push(session);
      i += 900000;
    }
  }

  return Times;
}

// get slots

function getSlots() {
  if (getElemnt("serviceCenter").value && getElemnt("appointmentDate").value) {
    $("ctrl-slots").innerHTML = spinner;
    fetch(
      `${baseURL}GetAvailableSlots?serviceCenterId=${
        getElemnt("serviceCenter").value
      }&date=${getElemnt("appointmentDate").value}`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        $("slots").innerHTML = "Available Slots!";
        let slots = handleDate(
          res.Data.workingHours.StartingHour,
          res.Data.workingHours.EndingHour
        );

        let timeSlots = res.Data.timeSlots.map(
          (t) => `${t.StartTime} - ${t.EndTime}`
        );
        $("slots").innerHTML = "";
        slots.forEach((r) => {
          let el = document.createElement("div");

          if (timeSlots.includes(r.replaceAll("\n", "").trim())) {
            el.setAttribute("class", "single-slot col-3");
            el.addEventListener("click", checkedSlot);
          } else {
            el.setAttribute("class", "single-slot col-3 disabled");
          }
          el.value = r;
          el.innerHTML = r;
          $("slots").appendChild(el);
        });
        $("ctrl-slots").innerHTML = "Show available Slots";
      })
      .catch((error) => {
        $("ctrl-slots").innerHTML = "";
        $("slots").innerHTML =
          '<small onclick="getSlots()" class="click">Try Again</small> ther is no available slots! ';
      });
  } else {
    $("ctrl-slots").setAttribute("class", "ctrl-slots text-danger click");
    $("ctrl-slots").innerHTML =
      "Please make sure that you checked service center and Appointment Date";
  }
}

// phone number handling
let interval;
let scnd = 60;
function setTimer(type = "start") {
  if (type === "end") {
    scnd = 60;
    $("send-otp-again").classList.remove("text-secondary");
    $("send-otp-again").classList.add("text-primary");
    clearInterval(interval);
  } else {
    interval = setInterval(() => {
      scnd -= 1;
      $("send-otp-again").innerHTML = `${scnd} second ..`;
      $("send-otp-again").classList.add("text-secondary");
      if (scnd === 56) {
        $("send-otp-again").innerHTML = "send again";
        $("send-otp-again").classList.remove("text-secondary");
        $("send-otp-again").classList.add("text-primary");
        clearInterval(interval);
      }
    }, 1000);
  }
}

function getPhoneNumber(phoneString) {
  return phoneString.replace("+", "").trim().replace(" ", "");
}
// -> initil number options
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  preferredCountries: ["eg", "jo", "co", "in", "de"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

function process(event) {
  event.preventDefault();
  const isValidNumber = phoneInput.isValidNumber();
  if (!isValidNumber) {
    document.querySelector("#phone_feadback").innerHTML =
      "Phone number is not valid!";
    document.getElementById("submit").classList.add("btn-secondary");
    document.getElementById("submit").classList.remove("btn-primary");
  } else {
    document.getElementById("submit").classList.remove("btn-secondary");
    document.getElementById("submit").classList.add("btn-primary");
    document.querySelector("#phone_feadback").innerHTML = "";
  }
}

function checkVerify() {
  let verifyClasses = $("verify").classList;

  const isValidNumber = phoneInput.isValidNumber();

  if (verifyClasses.contains("isVerified") || !isValidNumber) {
    return false;
  } else {
    let phoneNumber = getPhoneNumber(getElemnt("phone").value);
    if (phoneNumber.length > 8) {
      $("verify").innerHTML = spinner;
      fetch(`${baseURL}SendOtp?MobileNumber=${phoneNumber}`, {
        method: "POST",
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          $("modal").classList.add("active");
          getElFeadback("phone").innerHTML = "";
          $("verify").innerHTML = "verify";
          setTimer("end");
          setTimer("start");
        });
    } else {
      getElFeadback("phone").innerHTML = "phone number is required!";
    }
  }
}

$("modal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    $("modal").classList.remove("active");
    $("phone_feadback").innerHTML = "not Verfied";
    $("phone_feadback").classList.add("text-danger");
  }
});

getElemnt("phone").addEventListener("change", function reset() {
  $("verify").innerHTML = "Verfy";
  $("verify").classList.remove("text-danger");
  $("verify").classList.add("text-primary");
});

function sendOTP() {
  let OTP = "";
  for (let i = 1; i < 5; i++) {
    OTP += $(`num-${i}`).value;
    $(`num-${i}`).setAttribute("disabled", true);
  }
  let phoneNumber = getPhoneNumber(getElemnt("phone").value);

  $("");
  fetch(
    `${baseURL}VerifyOtp?MobileNumber=${phoneNumber
      .replace("%", "")
      .replace(" ", "")}&otp=${OTP}`
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      $("modal").classList.remove("active");
      $("phone_feadback").innerHTML = "Verfied";
      $("phone_feadback").classList.add("text-success");
      $("verify").setAttribute("class", "");
      $("verify").classList.add("verfied");
      for (let i = 1; i < 5; i++) {
        $(`num-${i}`).value = "";
        $(`num-${i}`).disabled = false;
      }
    })
    .catch((error) => {
      $("send-otp-again").innerHTML =
        "<small class='text-danger ' >Not verfied, </small> Send again";
      $("phone_feadback").classList.add("text-danger");
      $("verify").setAttribute("class", "");
      $("verify").classList.add("verify");
      $("verify").innerHTML = "verify";
      $("verify").innerHTML = "verify";
      for (let i = 1; i < 5; i++) {
        $(`num-${i}`).value = "";
        $(`num-${i}`).disabled = false;
      }
    });
}

function completType(event) {
  let idNum = +event.target.id.split("-")[1];
  if (idNum === 4 && $(event.target.id).value) {
    sendOTP();
  }
  if ($(event.target.id).value && idNum < 4) {
    $(`num-${idNum + 1}`).focus();
  }
  if (!$(event.target.id).value && idNum > 1) {
    $(`num-${idNum - 1}`).focus();
  }
}
