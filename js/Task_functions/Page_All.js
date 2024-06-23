import {Build_Element, Delay, Add_Element, Get_Element, Check, Assign_Element, Remove, Save} from "./Function_Tools.js";

export function Score(Parent, Class){
    let Read = JSON.parse(localStorage.getItem("Data"));

    let Score = Read[0].Score.toString().padStart(2, "0");

    let Score_Div = Build_Element("Div", Parent, false, null, "Score_Div", null, null, Class);
    Build_Element("h2",  Score_Div, false, `Todays Score:`, null, null, null, null);
    Build_Element("h2",  Score_Div, false, `${Score} points`, "Score", null, null, null);
}
