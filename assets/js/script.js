// Get Api Data

// Object.keys(formElements).map((input) => {
//   console.log(input);
//   getElById(input) &&
//     getElById(input).addEventListener("change", () => {
//       getElById("submit").removeAttribute("disabled");
//     });
// });

getElById("description").addEventListener("change", () => {
  getElById("submit").classList.remove("btn-secondary");
  getElById("submit").classList.add("btn-primary");
});

getElById("submit").addEventListener("click", (e) => {
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
