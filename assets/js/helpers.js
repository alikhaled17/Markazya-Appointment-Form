const Regex = {
  notEmpty: /\S/,
  exceptSpaceMaxTitle:
    /^[\u0621-\u064AA-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\x{0,50}]+$/g,
  exceptArMaxTitle: /^[A-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,50}]+$/g,
  exceptEnMaxTitle: /^[\u0621-\u064A0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,50}]+$/g,
  enCharWithNumbers: /^[A-Za-z0-9\s]+$/,
  mail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  numbers: /^[0-9]*$/,
};

const $ = (id) => document.getElementById(id); // return one element
const getAllElByClassName = (className) =>
  document.getElementsByClassName(className); // return array of element

const getElByQuery = (query) => document.querySelector(query); // return one element
const getAllElByQuery = (queryAll) => document.querySelectorAll(queryAll); // return array of element

const isEmpty = (value) => (value.trim() ? true : false);

function handleShowNumOfTime(num) {
  return num <= 9 ? `0${num}` : num;
}

function getElFeadback(elName) {
  return $(`${elName}_feadback`);
}
