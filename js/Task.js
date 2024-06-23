import {Build_Element, Delay, Add_Element, Get_Element, Check, Assign_Element, Remove, Save} from "./Task_functions/Function_Tools.js";
import {Score} from "./Task_functions/Page_All.js";
import {Initialize, Challenge, Choices, Answer, Day_Clock} from "./Task_functions/Page_1.js";
import {Update, Filter, Reset, Lock, Speech_Function} from "./Task_functions/Page_2.js";

let Update_Interval;
let Page_Id = "";
let Timer_Id = 0;

Pages();

function Pages()
{
    document.body.innerHTML = "";
    let Tabs = Build_Element("div", document.body, false, null, "Tabs", null, null, null);
    let Menu_Button_Entry = Build_Element("h2", Tabs, false, "≡", "Menu_Button_Entry", null, null, "Menu_Buttons");
    Menu_Button_Entry.addEventListener("click", () =>
    {
        Menu_Function();
    }
    )

    let Pages = [New_Task, Active_Tasks, Qr_Code_Generator];
    //default Page
    Pages[0]();
    
}
let Page_Ids = [];
let i = 0;
//Toggle Page
function Menu_Function()
{
    let Menu = Build_Element("div", document.body, false, null, "Menu", null, null, "Animate_Left");
    let Menu_Button = Build_Element("h2", Menu, false, "≡", "Menu_Button", null, null, "Menu_Buttons");
    Build_Element("label", Menu, false, "Menu", "Menu_Text", null, null, null);
    Add_Element("hr", Menu, false);

    Build_Element("label", Menu, false, "New_Task", "New_Task_Menu", null, null, "Task_Menu");
    Build_Element("label", Menu, false, "Active_Tasks", "Active_Tasks_Menu", null, null, "Task_Menu");
    Build_Element("label", Menu, false, "QR Code Generator", "QR_Code_Generator_Menu", null, null, "Task_Menu");
    
    let Buttons = document.querySelectorAll(".Task_Menu");

    Buttons.forEach(Button =>
    {
        Button.addEventListener("click", () =>
        {
            switch(Button.id)
            {
                case "New_Task_Menu":
                    Page_Id = "New_Task";
                    break;
                case "Active_Tasks_Menu":
                    Page_Id = "Active_Tasks";
                    break;
                case "QR_Code_Generator_Menu":
                    Page_Id = "QR_Code_Page";
                    break;
                default:
                    Page_Id = ""
                    break;
            }

            if(Page_Ids[i-1] !== Page_Id)
            {
                document.body.innerHTML = 
                `<div id="Tabs" class="null">
                    <h2 id="Menu_Button_Entry" class="Menu_Buttons">≡</h2>
                </div>`;
                let Menu_Button_Entry = Get_Element("Menu_Button_Entry");
                Menu_Button_Entry.addEventListener("click", () =>
                {
                    Menu_Function();
                })

                if(Button.id === "New_Task_Menu" && Page_Id === "New_Task")
                {
                    New_Task();
                }
                else if(Button.id === "Active_Tasks_Menu" && Page_Id === "Active_Tasks")
                {
                    Active_Tasks();
                }
                else if(Button.id === "QR_Code_Generator_Menu" && Page_Id === "QR_Code_Page")
                {
                    Qr_Code_Generator();
                }
                Page_Ids.push(Page_Id);
                i++;
            }  
        })
    })
    
    Menu_Button.addEventListener("click", async () =>
    {
        if(Menu !== null)
        {
            Assign_Element(Menu, "classList", "Animate_Right");
            await Delay(975);
            Remove(Menu, document.body, false);
        }   
    })
}

//Pages Structure

//Page 1
async function New_Task()
{  
    let Stats = Build_Element("div", document.body, false, null, "Stats_Div", null, null, null);
    let Div = Build_Element("div", document.body, false, null, "My_Div", null, null, null);
    Build_Element("h1", Div, false, "New Task", "New_Task", null, null, null);
    let Form = Build_Element("form", Div, false, "Challenge", "Challenge", null, null, null);

    let Inputs = [
        Add_Element("input", Form, true)
    ];

    let Inputs_Id = ["New_Task"];
    let Inputs_Index = 0;
    Inputs.forEach(Input =>
    {
        Assign_Element(Input, "type", "checkbox");
        Assign_Element(Input, "id", Inputs_Id[Inputs_Index] + "_Input");

        let Label = Form.insertBefore(Build_Element("label", Form, false, Inputs_Id[Inputs_Index], null, null, null, null), Input.nextElementSibling);
        Assign_Element(Label, "for", Inputs_Id[Inputs_Index]);
        Inputs_Index++;
    }
    )

    Initialize();
    Day_Clock(Stats);
    Score(Stats, "Top_Right");
    Inputs.forEach(Input =>
    {
        Input.addEventListener("click", () =>
        {
            Challenge(Input, Div);
        
            let Task_Choices = document.querySelectorAll("#Temp_Form input");
            Task_Choices.forEach(Task_Choice =>
            {
                Task_Choice.addEventListener("click", () =>
                {
                    Choices(Task_Choice, Task_Choices, Div);

                    let Picks = document.querySelectorAll(`#Choices_Form input`);
                    Picks.forEach(Pick =>
                        {
                            Pick.addEventListener("click", () =>
                            {
                                Answer(Pick, Picks, Task_Choice, Div, Timer_Id);
                            }
                        )
                        }
                    )
                }
                )
            }
            )
        }
        );
    }
    )
}
//Page 2
function Active_Tasks()
{
    //Reset();
    Filter();
    let Lock_Content = Lock();
    Score(document.body, "Bottom_Center");

    let P2Div = Build_Element("div", document.body, false, null, "Active_Tasks_Div", null, null, null);
    Build_Element("h1", P2Div, false, "Active Tasks Selection List", "Active_Tasks_Selection", null, null, null);
    let Grid = Build_Element("div", P2Div, false, null, "Grid", null, null, null);

    let Button_Ids = [];
    let Button_Id_Count = -1;

    let Temp = JSON.parse(localStorage.getItem("Data"));
    for(let i = 0; i < Temp[0].Current_Task.length; i++)
    {
        let Divs = Build_Element("div", Grid, false, null, `Divs_${i}`, null, null, "Grid_Items");
        let Active_Task = Build_Element("label", Divs, false, "None", `Active_Task_${i}`, null, null, "Active_Tasks");
        let Display = Build_Element("label", Divs, false, "00:00:00", `Timer_${i}`, null, null, null);
        let Button = Build_Element("button", Divs, true, "Start", `Button_${i}`, null, null, "Start_Buttons");    
        
        Timer_Id = i;
        let milliseconds = Temp[0].Timer[Timer_Id] + 1;
        Assign_Element(Active_Task, "textContent", Temp[0].Current_Task[Timer_Id]);
        Update(Display, Divs, Active_Task, milliseconds, Timer_Id, Update_Interval);
        
        Button.addEventListener("click", () =>
        {
            if(Lock_Content.textContent !== "🔏- Locked")
            {
                for(let j = 0; j < Grid.children.length; j++)
                {
                    if(Button.id === `Button_${j}`)
                    {
                        Timer_Id = j;
                    }
                }
        
                let Temp = JSON.parse(localStorage.getItem("Data"));
                let milliseconds = Temp[0].Timer[Timer_Id];
        
                if(Button.textContent === "Start")
                {
                    Button_Ids.push(Timer_Id);
                    Button_Id_Count++;
        
                    if(Update_Interval !== null)
                    {
                        clearInterval(Update_Interval);
                        let Previous_Button = Get_Element(`Button_${Button_Ids[Button_Id_Count-1]}`);
                        if(Previous_Button !== null)
                        {
                            Assign_Element(Previous_Button, "textContent", "Start");
                            Previous_Button.style.backgroundColor = "cyan";
        
                            let Audio = document.getElementById(`Audio_${Button_Ids[Button_Id_Count-1]}`);
                            let Parent = Get_Element(`Divs_${Button_Ids[Button_Id_Count-1]}`);
                            if(Audio !== null)
                            {
                                Audio.pause();
                                Remove(Audio, Parent, false);
                            } 
                        }
                    } 
                        
                    Update_Interval = setInterval(() =>
                    {
                        milliseconds -= 1;
                        Update(Display, Divs, Active_Task, milliseconds, Timer_Id, Update_Interval);
                    }, 10);
        
                    if(milliseconds > 0)
                    {
                        Assign_Element(Button, "textContent", "Stop");
                        Button.style.backgroundColor = "red";
                    }
                }
                else
                {
                    clearInterval(Update_Interval);
                    Assign_Element(Button, "textContent", "Start");
                            
                    Button.style.backgroundColor = "cyan";
                    let Audio = document.getElementById(`Audio_${Timer_Id}`);
                    if(Audio !== null)
                    {
                        Audio.pause();
                        Remove(Audio, Divs, false);
                    }     
                }
            }
        }
        )
    }
}

//Last Page
function Qr_Code_Generator()
{
    let QR_Div = Build_Element("div", document.body, false, null, "QR_Div", null, null, null);
    Build_Element("label", QR_Div, false, "QR Code Generator", null, null, null, null);
    Add_Element("hr", QR_Div, false);
    let Input = Build_Element("input", QR_Div, false, null, null, null, null, null);
    Input.placeholder = "Website URL";
    let Button = Build_Element("button", QR_Div, false, "Generate QR_Code", null, null, null, null);
    let QR_Code = Build_Element("img", QR_Div, false, null, null, null, null, null);
    
    Button.addEventListener("click", async () =>
    {
        if(Input.value.length > 0)
        {
            QR_Code.style.opacity = "0";
            await Delay(200);
            let Url = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${Input.value}`;
            QR_Code.style.padding = "px";
            QR_Code.src = Url;
            QR_Div.style.maxHeight = "300px";
            await Delay(400);
            QR_Code.style.opacity = "100";
        }
        else
        {
            QR_Code.style.opacity = "0";
            await Delay(1000);
            QR_Div.style.maxHeight = "140px";
            Button.textContent = "Generate QR_Code";
        }
    })

    Input.addEventListener("change", () =>
    {
        if(Input.value.length === 0)
        {
            Button.textContent = "Delete QR Code";
        }
    })
}
