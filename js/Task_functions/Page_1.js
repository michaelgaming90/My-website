import {Build_Element, Delay, Add_Element, Get_Element, Check, Assign_Element, Remove, Save} from "./Function_Tools.js";

export function Initialize()
{
    let Save_Files = [
        {
            Name: "Michael",
            Age: 17,
            Score: 0,
            Current_Task: "",
            Timer: 0, 
            Day_Registered: 0,
        }
    ];
    let str = JSON.stringify(Save_Files);

    if(localStorage.getItem("Data") === null)
    {
        localStorage.setItem("Data", str);
    }

    let Datas = JSON.parse(localStorage.getItem("Data"));
    if(Datas[0].Day_Registered === 0)
    {
        Datas[0].Day_Registered = new Date("Wed Feb 28 2024 08:00:00 GMT+0800 (Philippine Standard Time)");
    }

    if(Datas[0].Active_Task === null)
    {
        Datas[0].Active_Task = false;
    }

    if(!Array.isArray(Datas[0].Timer))
    {
        Datas[0].Timer = [];
    }

    if(!Array.isArray(Datas[0].Current_Task))
    {
        Datas[0].Current_Task = [];
    }

    if(!Array.isArray(Datas[0].Active_Task))
    {
        Datas[0].Active_Task = [];
    }
    //save
    let string = JSON.stringify(Datas);
    localStorage.setItem("Data", string);
}

export function Challenge(Input, Parent){
    if(Input.id === "New_Task_Input")
    {
        if(Input.checked)
        {
            let form = Build_Element("form", Parent, true, "New_Task", "Temp_Form", null, null, "Forms");
    
            let New_Checkboxs = [
                Add_Element("input", form, true),
                Add_Element("input", form, true),
                Add_Element("input", form, true),
                Add_Element("input", form, true),
                Add_Element("input", form, true),
                Add_Element("input", form, true)
            ];
    
            let Text_Contents = [
                "Bored", 
                "School_Work", 
                "Coding", 
                "Workout", 
                "cleaning", 
                "business"
            ];
    
            let Text_Index = 0;
            New_Checkboxs.forEach(New_Checkbox => {
                Build_Element(New_Checkbox, null, null, null, Text_Contents[Text_Index], "checkbox", "Tasks", null);
                let Label = form.insertBefore(Build_Element("label", form, false, Text_Contents[Text_Index], null, null, null, null), New_Checkbox.nextElementSibling);
                Assign_Element(Label, "for", Text_Contents[Text_Index]);
                Text_Index++;
            }
            )
        }
        else
        {
            try
            {
                let Forms = document.querySelectorAll(".Forms");
                Forms.forEach(Form =>{
                    Remove(Form, Parent, true);
                }
                )
            }
            catch(error)
            {}
        }
    }
    else
    {
        Check("Something is not Right");
    }
}

export function Choices(Task_Choice, Task_Choices, Parent)
{
    if(Task_Choice.checked)
    {
        Task_Choices.forEach(Sample =>
            {
                if(Task_Choice.id !== Sample.id)
                {
                    if(Sample.checked) 
                    {
                        let Sample_Form = document.getElementById(`Choices_Form`);
                        Remove(Sample_Form, Parent, true);
                        Sample.checked = false;
                    }
                }
            }
        )
        let Choices_Form = Build_Element("form", Parent, true, "Choices", `Choices_Form`, null, null, "Forms");
        Build_Element("p", Choices_Form, false, `Are you Ready for Task: ${Task_Choice.id}`, null, null, null, null);
        
        let Inputs = [
            Add_Element("input", Choices_Form, false),
            Add_Element("input", Choices_Form, true)
        ];

        let Labels_Text = ["Yes", "No"];
        let Labels_Index = 0;

        Inputs.forEach(Input =>
        {
            Build_Element(Input, Choices_Form, false, null, Labels_Text[Labels_Index], "checkbox", "Choices", null);
            let Label = Choices_Form.insertBefore(Build_Element("label", Choices_Form, false, Labels_Text[Labels_Index], null, null, null, null), Input.nextElementSibling);
            Assign_Element(Label, "for", Labels_Text[Labels_Index]);
            Labels_Index++;
        }
    )
    }
    else
    {
        let Sample = document.getElementById(`Choices_Form`);
        Remove(Sample, Parent, true);
    }
}

export function Answer(Pick, Picks, Task_Choice, Parent, Timer_Id)
{
    if(Pick.checked)
    {
        Picks.forEach(Sample =>
            {
                if(Pick.id !== Sample.id)
                {  
                    if(Sample.checked)
                    {
                        let Sample_Form = document.getElementById(`P`);
                        Remove(Sample_Form, Parent, true);
                        Sample.checked = false;
                    } 
                }
            }
        )

        if(Pick.id === "Yes")
        {
            let Random_Num = Math.floor(Math.random() * 30 +1);
            Build_Element("p", Parent, true, `You have to do ${Task_Choice.id} for ${Random_Num} minutes`, "P", null, null, "Forms");

            Save(0, "Timer", Random_Num*60*100, Timer_Id);
            Save(0, "Current_Task", Task_Choice.id, Timer_Id);
            Save(0, "Active_Task", true, Timer_Id);
        }
        else if(Pick.id === "No")
        {
            Build_Element("p", Parent, true, "Come Back When You're Ready", "P", null, null, "Forms");
        }
    }
    else
    {
        let p = document.getElementById(`P`);
        Remove(p, Parent, true);
    }
}

export function Day_Clock(Parent)
{
    Build_Element("h1", Parent, false, "Time Spent", "Time Spent", null, null, null);
    let Day_Counter = Build_Element("h2", Parent, false, "Day: 1", null, null, null, null);
    let Day = Build_Element("h2", Parent, false, "00:00:00", null, null, null, null);
    
    setInterval(()=>
    {
        Day_Update(Day_Counter, Day)
    }, 1000);
}

function Day_Update(Day_Counter, Day)
{
    let Read = JSON.parse(localStorage.getItem("Data"));

    let Then = new Date(Read[0].Day_Registered);
    Then.setHours(Then.getHours() - 8);

    let Now = new Date();
    let milliseconds = Now - Then;

    let Seconds = Math.floor(milliseconds/1000) % 60;
    let Minutes = Math.floor(milliseconds/(60*1000)) % 60;
    let Hours = Math.floor(milliseconds/(60*60*1000));
    let Days = Math.floor(milliseconds/(24*60*60*1000));

    Seconds = Seconds.toString().padStart(2, "0");
    Minutes = Minutes.toString().padStart(2, "0");
    Hours = Hours.toString().padStart(2, "0");
    Days = Days.toString().padStart(2, "0");

    Assign_Element(Day_Counter, "textContent", `Day: #${Days}`);
    Assign_Element(Day, "textContent", `${Hours}hours: ${Minutes}mins: ${Seconds}sec`);
}