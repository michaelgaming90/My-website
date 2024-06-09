const Div = document.getElementById("My_Div");
const Stats = document.getElementById("Stats_Div");
const Inputs = document.querySelectorAll("#My_Div input");

let Random_Num = 0;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;

Start();
let Update_Interval;

function Initialize()
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

    let string = JSON.stringify(Datas);
    localStorage.setItem("Data", string);
}

async function Start()
{  
    Initialize();
    Day_Clock();
    Score();
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
            let form = Build_Element("form", Div, true, "New_Task", "Temp_Form", null, null, "Forms");
    
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
                    Remove(Form, Div, true);
                }
                )
            }
            catch(error)
            {}
        }
    }
    else if(Input.id === "Display")
    {
        if(Input.checked)
        {
            //Read
            let Temp = JSON.parse(localStorage.getItem("Data"));

            let Container = Build_Element("div", Div, true, null, "Container", null, null, null);
            Build_Element("p", Container, true, Temp[0].Current_Task, "Task", null, null, null);
            let Display = Build_Element("p", Container, false, "00:00:00", "Timer", null, null, "Timers");
            let Button = Build_Element("button", Container, true, "Start", "Start", null, null, null);
            
            milliseconds = Temp[0].Timer + 1;
            milliseconds = 2;
            Update(Display, Container);
            
            Button.addEventListener("click", () =>
            {
                if(Button.textContent === "Start")
                {
                    Update_Interval = setInterval(() =>
                    {
                        Update(Display, Container);
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
                    let Audio = document.getElementById("Audio");
                    if(Audio !== null)
                    {
                        Remove(Audio, Container, false);
                    }     
                }
            }
            )
        }
        else
        {
            clearInterval(Update_Interval);

            let Display = document.getElementById("Container");
            Remove(Display, Div, true);
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
                        Remove(Sample_Form, Div, true);
                        Sample.checked = false;
                    }
                }
            }
        )
        let Choices_Form = Build_Element("form", Div, true, "Choices", `Choices_Form`, null, null, "Forms");
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
        Remove(Sample, Div, true);
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
                        Remove(Sample_Form, Div, true);
                        Sample.checked = false;
                    } 
                }
            }
        )

        if(Pick.id === "Yes")
        {
            Random_Num = Math.floor(Math.random() * 30 +1);
            Build_Element("p", Div, true, `You have to do ${Task_Choice.id} for ${Random_Num} minutes`, "P", null, null, "Forms");

            Save(0, "Timer", Random_Num*60*100);
            Save(0, "Current_Task", Task_Choice.id);
            Save(0, "Active_Task", true);
        }
        else if(Pick.id === "No")
        {
            Build_Element("p", Div, true, "Come Back When You're Ready", "P", null, null, "Forms");
        }
    }
    else
    {
        let p = document.getElementById(`P`);
        Remove(p, Div, true);
    }
}

function Update(Display, Container)
{
    if(milliseconds <= 0)
    {
        clearInterval(Update_Interval);

        let Read = JSON.parse(localStorage.getItem("Data"));

        let Audio = document.getElementById("Audio");
        if(Audio === null && Read[0].Active_Task)
        {
            Save(0, "Score", 2);

            let audio = Add_Element("audio", Container, false);
            audio.classList = "Audios";
            audio.id = "Audio";
            audio.loop = true;
            audio.src = "../audio/civil-defense-siren-128262.mp3";
            audio.play();

            let Task = document.getElementById("Task");
            Assign_Element(Task, "textContent", "Finished")

            Save(0, "Active_Task", false);
        }   
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

function Day_Clock()
{
    Build_Element("h1", Stats, false, "Time Spent", "Time Spent", null, null, null);
    let Day_Counter = Build_Element("h2", Stats, false, "Day: 1", null, null, null, null);
    let Day = Build_Element("h2", Stats, false, "00:00:00", null, null, null, null);
    
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

function Score(){
    let Read = JSON.parse(localStorage.getItem("Data"));

    let Score = Read[0].Score.toString().padStart(2, "0");

    let Score_Div = Build_Element("Div", Stats, false, null, "Score_Div", null, null, null);
    Build_Element("h2",  Score_Div, false, `Todays Score:`, null, null, null, null);
    Build_Element("h2",  Score_Div, false, `${Score} points`, "Score", null, null, null);
}

//function Tools
function Build_Element(Type, Parent, bool, Text_Content, Id, Element_Type, Name, Class)
{
    let Element;
    if(typeof Type === "string")
    {
        Element = Add_Element(Type, Parent, bool);
    }
    else{
        Element = Type;
    }
    
    Element.textContent = Text_Content;
    Element.id = Id;
    Element.type = Element_Type;
    Element.name = Name;
    Element.classList = Class;

    return Element;
}

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

function Remove(Element, parent, bool)
{
    parent.removeChild(Element);

    if(bool)
    {
        let brs = document.querySelectorAll(`#My_Div br`);
        let br = brs[brs.length - 1];
        Div.removeChild(br);
    } 
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
    else if(property === "Score")
    {
        Saved[index].Score += value;
        let Score = document.getElementById("Score");
        let Points = Saved[index].Score.toString().padStart(2, "0");
        Assign_Element(Score, "textContent", `${Points} points`);
    }
    else if(property === "Active_Task")
    {
        Saved[index].Active_Task = value;
    }
    
    let Str = JSON.stringify(Saved);
    localStorage.setItem("Data", Str);
}
