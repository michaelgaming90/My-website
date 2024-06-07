const Submit_Button = document.getElementById("My_Button");
const Name = document.getElementById("My_Name");
const Age = document.getElementById("My_Age");
const Student_Status = document.getElementById("My_Student_Status");

let Fullname = "Michael Andy S. Alicpala";
let My_Age = 16;
let isStudent = true;

Submit_Button.onclick = function(){
    Fullname = Name.value;
    My_Age = Age.value;
    My_Age = Number(My_Age);
    My_Age +=1;
    isStudent = Student_Status.value;

    document.getElementById("P1").textContent = `Your Full Name is: ${Fullname}`;
    document.getElementById("P2").textContent = `Your Age is: ${My_Age}`;
    document.getElementById("P3").textContent = `Your Student Status is: ${isStudent}`;
}
