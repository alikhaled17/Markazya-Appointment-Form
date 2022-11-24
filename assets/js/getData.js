const baseURL = "http://167.86.97.165:86/api/v1/ServiceCenters/";

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

const submitForm = getElById("submit");

const getElemnt = (name) => {
  return getElById(formElements[name].name);
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
  if (getElemnt("serviceCenter").value) {
    fetch(
      `${baseURL}GetAvailableSlots?serviceCenterId=${
        getElemnt("serviceCenter").value
      }&date=${getElemnt("appointmentDate").value}`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        getElById("slots").innerHTML = "Available Slots!";
        let slots = handleDate(
          res.Data.workingHours.StartingHour,
          res.Data.workingHours.EndingHour
        );

        let timeSlots = res.Data.timeSlots.map(
          (t) => `${t.StartTime} - ${t.EndTime}`
        );
        getElById("slots").innerHTML = "";
        slots.forEach((r) => {
          let el = document.createElement("div");

          if (timeSlots.includes(r.replaceAll("\n", "").trim())) {
            el.setAttribute("class", "col-3 disabled");
          } else {
            el.setAttribute("class", "col-3");
          }
          el.value = r;
          el.innerHTML = r;
          getElById("slots").appendChild(el);
        });
      })
      .catch((error) => {
        getElById("ctrl-slots").innerHTML = "";
        getElById("slots").innerHTML =
          '<small onclick="getSlots()" class="click">Try Again</small> ther is no available slots! ';
      });
  }
}
getElById("ctrl-slots").addEventListener("click", getSlots());

getElById("verify").addEventListener("click", function checkVerify() {
  let verifyClasses = getElById("verify").classList;
  if (verifyClasses.contains("isVerified")) {
    return false;
  } else {
    let phoneNumber = getElemnt("phone")
      .value.replace("+", "")
      .trim()
      .replace(" ", "");
    if (phoneNumber.length > 8) {
      fetch(`${baseURL}SendOtp?MobileNumber=${phoneNumber}`, { method: "POST" })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          getElById("modal").classList.add("active");
          getElFeadback("phone").innerHTML = "";
        });
    } else {
      getElFeadback("phone").innerHTML = "phone number is required!";
    }
  }
});

getElById("modal").addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    getElById("modal").classList.remove("active");
    getElById("verify").innerHTML = "not Verfied";
    getElById("verify").classList.add("text-danger");
  }
});

getElemnt("phone").addEventListener("change", function reset() {
  getElById("verify").innerHTML = "Verfy";
  getElById("verify").classList.remove("text-danger");
  getElById("verify").classList.add("text-primary");
});

getElById("submit-verify").addEventListener("click", function sendOTP() {
  let OTP = "";
  for (let i = 1; i < 5; i++) {
    OTP += getElById(`num-${i}`).value;
  }
  let phoneNumber = getElemnt("phone")
    .value.replace("+", "")
    .trim()
    .replace(" ", "");
  fetch(`${baseURL}VerifyOtp?MobileNumber=${phoneNumber}&otp=${OTP}`)
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
