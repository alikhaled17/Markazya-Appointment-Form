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
    console.log(res.Data);
    res.Data.forEach((r) => {
      let el = document.createElement("option");
      el.value = r.ServiceCenterId;
      el.innerHTML = r.ServiceCenterName;
      getElemnt("serviceCenter").appendChild(el);
    });
  });

// create service center list
fetch(`${baseURL}GetBrandModels?brand=Toyota`)
  .then((res) => {
    console.log(res);
    return res.json();
  })
  .then((res) => {
    console.log(res.Data);
    res.Data.forEach((r) => {
      let el = document.createElement("option");
      el.value = r.ModelID;
      el.innerHTML = r.ModelName;
      getElemnt("model").appendChild(el);
    });
  });
