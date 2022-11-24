const Regex = {
  notEmpty: /\S/,
  exceptSpaceMaxTitle:
    /^[\u0621-\u064AA-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\x{0,50}]+$/g,
  exceptArMaxTitle: /^[A-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,50}]+$/g,
  exceptEnMaxTitle: /^[\u0621-\u064A0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,50}]+$/g,
  enCharWithNumbers: /^[A-Za-z0-9\s]+$/,
};

const getElById = (id) => document.getElementById(id); // return one element
const getAllElByClassName = (className) =>
  document.getElementsByClassName(className); // return array of element

const getElByQuery = (query) => document.querySelector(query); // return one element
const getAllElByQuery = (queryAll) => document.querySelectorAll(queryAll); // return array of element

const isEmpty = (value) => (value.trim() ? true : false);

const getLength = (value) => value.length;