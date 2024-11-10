const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^&*(){}:"><?/.,][|';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength circle to grey
setIndicator("#ccc");


// handle the slider and set password length
//this function reflect password length on UI

function handleSlider(){
// setting the default value
inputSlider.value=passwordLength;
lengthDisplay.innerText=passwordLength;
const min=inputSlider.min;
const max=inputSlider.max;
inputSlider.style.backgroundSize= ((passwordLength-min)*100/(max-min)) + "% 100%";
}

// this function changes the color of indicator as per the strength of password

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}

// this function generate a random integer in range of min and max;
function getRndInteger(min,max){
     return  Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
 return getRndInteger(0,9);

}

function generateLowerCase(){
    // this line generate a random lowercase letter
  return String.fromCharCode(getRndInteger(97,123));

}



function generateUpperCase(){
    // this line generate a random uppercase letter
  return String.fromCharCode(getRndInteger(65,91));
 
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum) ;
}

// this function check the strength of password on the basis of some condition

function calcStrength(){
  let hasUpper=false;
  let hasLower=false;
  let hasNum=false;
  let hasSys=false;

  if(uppercaseCheck.checked) hasNum=true;
  if(lowercaseCheck.checked) hasLower=true;
  if(numbersCheck.checked) hasNum=true;
  if(symbolsCheck.checked) hasSym=true;

if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8 ){
  setIndicator("#0f0");
}else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6){
  setIndicator("#ff0");
}else{
  setIndicator("#f00");
}
}


async function  copyContent(){
  // to copy anything on the clipborad ,we use below method
  try{
    await(navigator.clipboard.writeText(passwordDisplay.value));
    copyMsg.innerText="copied";
  }catch(e){

    copyMsg.innerText="failed";
  }
  // to make copy vala span visible
 copyMsg.classList.add("active");

 setTimeout( () =>{
  copyMsg.classList.remove("active");
 },2000);

}

// this function count number of checkbox checked
function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach((checkbox)=>{
    if(checkbox.checked){
      checkCount++;
     }
  });

  //special condition

  if(passwordLength<checkCount){
passwordLength=checkCount;
handleSlider();
  }


}

// this function add event listener on all check boxes

allCheckBox.forEach( (checkbox)=>{
  checkbox.addEventListener('change',handleCheckBoxChange);
});



// this code set the length of password as per the position of slider
inputSlider.addEventListener('input',(e)=>{
  passwordLength=e.target.value;
  handleSlider();
});


copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value){
    copyContent();
  }
});

function shufflePassword( array){
  // fisher yates method is used to shuffle the array
for(let i=array.length-1;i>0 ;i--){
  const j=Math.floor(Math.random()*(i+1));
  const temp=array[i];
  array[i]=array[j];
  array[j]=temp;
}
let str="";
array.forEach((el)=>(str+=el));
return str;

}



generateBtn.addEventListener('click',()=>{
    
  if(checkCount<=0) return;
   
  if(passwordLength<checkCount){
passwordLength=checkCount;
handleSlider();
  }

  // from here the code is to find the new password

password="";

//  lets put the stuff mentioned by checkboxes;
// if(uppercaseCheck.checked){
//   password+=generateUpperCase();
// }
// if(lowercaseCheck.checked){
//   password+=generateLowerCase();
// }
// if(numbersCheck.checked){
//   password+=generateRandomNumber();
// }
// if(symbolsCheck.checked){
//   password+=generateSymbol();
// }

let funcArr=[];

if(uppercaseCheck.checked)
  funcArr.push(generateUpperCase);

if(lowercaseCheck.checked)
  funcArr.push(generateLowerCase);

if(numbersCheck.checked)
  funcArr.push(generateRandomNumber);

if(symbolsCheck.checked)
  funcArr.push(generateSymbol);

// compulsory  Addition

for(let i=0;i<funcArr.length; i++){
  password+=funcArr[i]();
}


// remaining addition

for(let i=0;i<passwordLength-funcArr.length;i++){
  let randIndex=getRndInteger(0,funcArr.length);
  password+=funcArr[randIndex]();
}

// shuffle the password

password=shufflePassword(Array.from(password));

// show this password in UI


passwordDisplay.value=password;

// calculate strength;

calcStrength();

});
