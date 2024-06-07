const Div = document.getElementById("My_Div");
const Inputs = document.querySelectorAll("#My_Div input");

let Random_Num = 0;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;

Start();
let Update_Interval;

function Initialize()
{
    let Save_File = [
        {
            Name: "Michael",
            Age: 17,
            Score: 0,
            Current_Task: "",
            Timer: 0, 
            Day_Registered: 0,
        }
    ];
    let str = JSON.stringify(Save_File);

    if(localStorage.getItem("Data") === null)
    {
        localStorage.setItem("Data", str);
    }
}

async function Start()
{  
    Initialize();
    Inputs.forEach(Input =>
    {
        Input.addEventListener("click", () =>
        {
            Challenge(Input);
        
            let Task_Choices = document.querySelectorAll("#Temp_Form input");
            Task_Choices.forEach(Task_Choice =>
            {
                Task_Choice.addEventListener("click", () =>
                {
                    Choices(Task_Choice, Task_Choices);

                    let Picks = document.querySelectorAll(`#Choices_Form input`);
                    Picks.forEach(Pick =>
                        {
                            Pick.addEventListener("click", () =>
                            {
                                Answer(Pick, Picks, Task_Choice);
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

function Challenge(Input){
    if(Input.id === "New_Task")
    {
        if(Input.checked)
        {
            let form = Add_Element("form", Div, true);
            Assign_Element(form, "textContent", "New_Task");
            Assign_Element(form, "id", "Temp_Form");
    
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
    
                Assign_Element(New_Checkbox, "type", "checkbox");
                let Label = form.insertBefore(Add_Element("label", form, false), New_Checkbox.nextElementSibling);
                Assign_Element(Label, "for", Text_Contents[Text_Index]);
                Assign_Element(Label, "textContent", Text_Contents[Text_Index]);
            
                Assign_Element(New_Checkbox, "name", "Tasks");
                Assign_Element(New_Checkbox, "id", Text_Contents[Text_Index]);
                Text_Index++;
            }
            )
        }
        else
        {
            let form = document.getElementById("Temp_Form");
            Remove(form);
        }
    }
    else if(Input.id === "Display")
    {
        if(Input.checked)
        {
            let Container = Add_Element("div", Div, true);
            Assign_Element(Container, "id", "Container");

            let Temp = JSON.parse(localStorage.getItem("Data"));

            let Task = Add_Element("p", Container, true);
            Assign_Element(Task, "textContent", Temp[0].Current_Task);
            Assign_Element(Task, "id", "Task");

            let Display = Add_Element("p", Container, false);
            Assign_Element(Display, "id", "Timer");
            Assign_Element(Display, "textContent", "00:00:00");
            Assign_Element(Display, "classList", "Timers");

            let Button = Add_Element("button", Container, true);
            Assign_Element(Button, "id", "Start");
            Assign_Element(Button, "textContent", "Start");
            milliseconds = Temp[0].Timer + 1;
            Update(Display, Container);
            
            Button.addEventListener("click", () =>
            {
                if(Button.textContent === "Start")
                {
                    Update_Interval = setInterval(() =>
                    {
                        Update(Display, Container);
                    }, 10);
                    Assign_Element(Button, "textContent", "Stop");
                    Button.style.backgroundColor = "red";
                }
                else
                {
                    clearInterval(Update_Interval);
                    Assign_Element(Button, "textContent", "Start");
                    Button.style.backgroundColor = "cyan";
                    let Audio = document.getElementById("Audio");
                    Audio.pause();
                }
            }
            )
        }
        else
        {
            clearInterval(Update_Interval);

            let Display = document.getElementById("Container");
            Remove(Display);
        }
    }
    else
    {
        Check("Something is not Right");
    }
}

function Choices(Task_Choice, Task_Choices)
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
                        Remove(Sample_Form);
                        Sample.checked = false;
                    }
                }
            }
        )

        let Choices_Form = Add_Element("form", Div, true);
        Assign_Element(Choices_Form, "textContent", "Choices");
        Assign_Element(Choices_Form, "id", `Choices_Form`);
        
        let Paragraph = Add_Element("p", Choices_Form, false);
        Assign_Element(Paragraph, "textContent", `Are you Ready for Task: ${Task_Choice.id}`)
        
        let Inputs = [
            Add_Element("input", Choices_Form, false),
            Add_Element("input", Choices_Form, true)
        ];

        let Labels_Text = ["Yes", "No"];
        let Labels_Index = 0;

        Inputs.forEach(Input =>
        {
            Assign_Element(Input, "type", "checkbox");
            Assign_Element(Input, "name", "Choices");
            Assign_Element(Input, "id", Labels_Text[Labels_Index]);

            let Label = Choices_Form.insertBefore(Add_Element("label", Choices_Form, false), Input.nextElementSibling);
            Assign_Element(Label, "textContent", Labels_Text[Labels_Index]);
            Labels_Index++;
        }
    )
    }
    else
    {
        let Sample = document.getElementById(`Choices_Form`);
        Remove(Sample);
    }
}

function Answer(Pick, Picks, Task_Choice)
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
                        Remove(Sample_Form);
                        Sample.checked = false;
                    } 
                }
            }
        )

        if(Pick.id === "Yes")
        {
            let p = Add_Element("p", Div, false);
            Random_Num = Math.floor(Math.random() * 30 +1);
            Assign_Element(p, "id", `P`);
            Assign_Element(p, "textContent", `You have to do ${Task_Choice.id} for ${Random_Num} minutes`);

            Save(0, "Timer", Random_Num*60*100);
            Save(0, "Current_Task", Task_Choice.id);
        }
        else if(Pick.id === "No")
        {
            let p = Add_Element("p", Div, true);
            Assign_Element(p, "id", `P`);
            Assign_Element(p, "textContent", `Come Back When You're Ready`);
        }
    }
    else
    {
        let p = document.getElementById(`P`);
        Remove(p);
    }
}

function Update(Display, Container)
{
    if(milliseconds <= 0)
    {
        clearInterval(Update_Interval);
        let audio = Add_Element("audio", Container, true);
        audio.classList = "Audios";
        audio.id = "Audio";
        audio.src = "../audio/civil-defense-siren-128262.mp3";
        audio.play();
    }
    else
    {
        milliseconds -= 1;
        seconds = Math.floor(milliseconds/100);
        minutes = Math.floor(seconds/60);
    
        let sec = seconds % 60;
        let mil = milliseconds % 100;

        mil = mil.toString().padStart(2, 0);
        sec = sec.toString().padStart(2, 0);
        minutes = minutes.toString().padStart(2, 0);
        Save(0, "Timer", milliseconds);

        Assign_Element(Display, "textContent", `${minutes}:${sec}:${mil}`);
    }
}

//function Tools
function Delay(ms)
{
    return new Promise((resolve, reject) =>
        {
            setTimeout(resolve,ms);
        }
    )
}

function Add_Element(Type, parent, bool)
{
    if(bool)
    {
        let br = document.createElement("br");
        parent.appendChild(br);
    }

    let H1 = document.createElement(Type);
    parent.appendChild(H1);

    return H1;
}

function Check(type)
{
    console.log(type);
}

function Assign_Element(Element, property, value){
    if(property === "textContent"){
        Element.textContent = value;
    }
    else if(property === "id")
    {
        Element.id = value;
    }
    else if(property === "type")
    {
        Element.type = value;
    }
    else if(property === "name")
    {
        Element.name = value;
    }
    else if(property === "for")
    {
        Element.setAttribute(property, value);
    }
    else if(property === "classList")
    {
        Element.classList = value;
    }
    else
    {
        Element.property = value;
    }
}

function Remove(Element)
{
    Div.removeChild(Element);

    let brs = document.querySelectorAll(`#My_Div br`);
    let br = brs[brs.length - 1];
    Div.removeChild(br);
}

function Save(index, property, value)
{
    let Saved = JSON.parse(localStorage.getItem("Data"));

    if(property === "Current_Task")
    {
        Saved[index].Current_Task = value;
    }
    else if(property === "Timer")
    {   
        Saved[index].Timer = value;
    }
    
    let Str = JSON.stringify(Saved);
    localStorage.setItem("Data", Str);
}
