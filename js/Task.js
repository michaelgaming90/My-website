let Update_Interval;
let Page_Id;

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
    //default Page
    Active_Tasks();
    
}
//Toggle Page
function Menu_Function()
{
    let Menu = Build_Element("div", document.body, false, null, "Menu", null, null, "Animate_Left");
    let Menu_Button = Build_Element("h2", Menu, false, "≡", "Menu_Button", null, null, "Menu_Buttons");
    Build_Element("label", Menu, false, "Menu", "Menu_Text", null, null, null);
    Add_Element("hr", Menu, false);
    let New_Task_Menu = Build_Element("label", Menu, false, "New_Task", "New_Task_Menu", null, null, "Task_Menu");
    let Active_Tasks_Menu = Build_Element("label", Menu, false, "Active_Tasks", "Active_Tasks_Menu", null, null, "Task_Menu");
    
    New_Task_Menu.addEventListener("click", () =>
    {
        if(Page_Id !== "New_Task")
        {
            document.body.innerHTML = 
            `<div id="Tabs" class="null">
                <h2 id="Menu_Button_Entry" class="Menu_Buttons">≡</h2>
            </div>`;
            Menu_Button_Entry = Get_Element("Menu_Button_Entry");
            Menu_Button_Entry.addEventListener("click", () =>
            {
                Menu_Function();
            }
            )
            New_Task();
        }
    }
    )

    Active_Tasks_Menu.addEventListener("click", () =>
    {
        if(Page_Id !== "Active_Tasks")
        {
            document.body.innerHTML = 
            `<div id="Tabs" class="null">
                <h2 id="Menu_Button_Entry" class="Menu_Buttons">≡</h2>
            </div>`;
            Menu_Button_Entry = Get_Element("Menu_Button_Entry");
            Menu_Button_Entry.addEventListener("click", () =>
            {
                Menu_Function();
            }
            )
            Active_Tasks();
        }
    }
    )

    Menu_Button.addEventListener("click", async () =>
    {
        if(Menu !== null)
        {
            Assign_Element(Menu, "classList", "Animate_Right");
            await Delay(975);
            Remove(Menu, document.body, false);
        }   
    }
    )
}
//All Page
function Score(Parent){
    let Read = JSON.parse(localStorage.getItem("Data"));

    let Score = Read[0].Score.toString().padStart(2, "0");

    let Score_Div = Build_Element("Div", Parent, false, null, "Score_Div", null, null, null);
    Build_Element("h2",  Score_Div, false, `Todays Score:`, null, null, null, null);
    Build_Element("h2",  Score_Div, false, `${Score} points`, "Score", null, null, null);
}

//Page 2
function Active_Tasks()
{
    //Reset();
    Filter();
    Score(document.body);

    let P2Div = Build_Element("div", document.body, false, null, "Active_Tasks_Div", null, null, null);
    Build_Element("h1", P2Div, false, "Active Tasks Selection List", "Active_Tasks_Selection", null, null, null);
    let Grid = Build_Element("div", P2Div, false, null, "Grid", null, null, null);

    let Temp = JSON.parse(localStorage.getItem("Data"));

    let Button_Ids = [];
    let Button_Id_Count = -1;

    for(let i = 0; i < Temp[0].Current_Task.length; i++)
    {
        let Divs = Build_Element("div", Grid, false, null, `Divs_${i}`, null, null, "Grid_Items");
        let Active_Task = Build_Element("label", Divs, false, "None", `Active_Task_${i}`, null, null, "Active_Tasks");
        let Display = Build_Element("label", Divs, false, "00:00:00", `Timer_${i}`, null, null, null);
        let Button = Build_Element("button", Divs, true, "Start", `Button_${i}`, null, null, "Start_Buttons");    
        
        Timer_Id = i;
        let milliseconds = Temp[0].Timer[Timer_Id] + 1;
        Assign_Element(Active_Task, "textContent", Temp[0].Current_Task[Timer_Id]);
        Update(Display, Divs, Active_Task, milliseconds, Timer_Id);
        
        Button.addEventListener("click", () =>
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

                Check(Button_Ids);
                Check(Button_Id_Count);
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
                    Update(Display, Divs, Active_Task, milliseconds, Timer_Id);
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
        )
    }
    Page_Id = "Active_Tasks";
}

function Update(Display, Container, Active_Tasks, milliseconds, Timer_Id)
{
    if(milliseconds <= 0)
    {
        clearInterval(Update_Interval);

        let Read = JSON.parse(localStorage.getItem("Data"));

        let Audio = document.getElementById(`Audio_${Timer_Id}`);
        if(Audio === null && Read[0].Active_Task[Timer_Id])
        {
            Save(0, "Score", 2);

            let audio = Add_Element("audio", Container, false);
            audio.classList = "Audios";
            audio.id = `Audio_${Timer_Id}`;
            audio.loop = true;
            audio.src = "../audio/civil-defense-siren-128262.mp3";
            audio.play();

            Assign_Element(Active_Tasks, "textContent", "Finished");
            Save(0, "Current_Task_2", "Finished");
            Save(0, "Active_Task_2", false);
        }   
    }
    else
    {
        milliseconds -= 1;
        let seconds = Math.floor(milliseconds/100);
        let minutes = Math.floor(seconds/60);
    
        let sec = seconds % 60;
        let mil = milliseconds % 100;

        mil = mil.toString().padStart(2, 0);
        sec = sec.toString().padStart(2, 0);
        minutes = minutes.toString().padStart(2, 0);
        Save(0, "Timer_2", milliseconds);
        Assign_Element(Display, "textContent", `${minutes}:${sec}:${mil}`);
    }
}

function Filter()
{
    let Temp = JSON.parse(localStorage.getItem("Data"));
    if(Temp[0].Current_Task.length !== 0 && Temp[0].Timer.length !== 0 && Temp[0].Active_Task.length !== 0)
    {
        Temp[0].Current_Task = Temp[0].Current_Task.filter(Task =>
        {
            return Task !== "Finished" && Task !== null;
        }
        )
    
        Temp[0].Timer = Temp[0].Timer.filter(Timer =>
        {
             return Timer !== 0 && Timer !== null;
        }
        )

        Temp[0].Active_Task = Temp[0].Active_Task.filter(Task => 
        {
            return Task !== false && Task!== null;
        }
        )
    }

    let Str = JSON.stringify(Temp);
    localStorage.setItem("Data", Str);
}

function Reset()
{
    let Save_Data = JSON.parse(localStorage.getItem("Data"));

    Save_Data[0].Current_Task = [];
    Save_Data[0].Timer = [];
    Save_Data[0].Active_Task = [];
    let str = JSON.stringify(Save_Data);
    localStorage.setItem("Data", str);
}

//Page 1
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

async function New_Task()
{  
    let Stats = Build_Element("div", document.body, false, null, "Stats_Div", null, null, null);
    let Div = Build_Element("div", document.body, false, null, "My_Div", null, null, null);
    Build_Element("h1", Div, false, "Task", "Head", null, null, null);
    let Form = Build_Element("form", Div, false, "Challenge", "Challenge", null, null, null);

    let Inputs = [
        Add_Element("input", Form, true)
    ];

    let Inputs_Id = ["New_Task"];
    let Inputs_Index = 0;
    Inputs.forEach(Input =>{
        Assign_Element(Input, "type", "checkbox");
        Assign_Element(Input, "id", Inputs_Id[Inputs_Index]);

        let Label = Form.insertBefore(Build_Element("label", Form, false, Inputs_Id[Inputs_Index], null, null, null, null), Input.nextElementSibling);
        Assign_Element(Label, "for", Inputs_Id[Inputs_Index]);
        Inputs_Index++;
    }
    )

    Initialize();
    Day_Clock(Stats);
    Score(Stats);
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
                                Answer(Pick, Picks, Task_Choice, Div);
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
    Page_Id = "New_Task";
}

function Challenge(Input, Parent){
    if(Input.id === "New_Task")
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

function Choices(Task_Choice, Task_Choices, Parent)
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

function Answer(Pick, Picks, Task_Choice, Parent)
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

            Save(0, "Timer", (Random_Num*60*100));
            Save(0, "Current_Task", Task_Choice.id);
            Save(0, "Active_Task", true);
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

function Day_Clock(Parent)
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

function Get_Element(Id)
{
    return document.getElementById(Id);
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
        parent.removeChild(br);
    } 
}

function Save(index, property, value)
{
    let Saved = JSON.parse(localStorage.getItem("Data"));

    if(property === "Current_Task")
    {
        Saved[index].Current_Task.push(value);
    }
    else if(property === "Current_Task_2")
    {
        Saved[index].Current_Task[Timer_Id] = value;
    }
    else if(property === "Timer")
    {   
        Saved[index].Timer.push(value);
    }
    else if(property === "Timer_2")
    {   
        Saved[index].Timer[Timer_Id] = value;
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
        Saved[index].Active_Task.push(value);
    }
    else if(property === "Active_Task_2")
    {
        Saved[index].Active_Task[Timer_Id] = value;
    }
    
    let Str = JSON.stringify(Saved);
    localStorage.setItem("Data", Str);
}
