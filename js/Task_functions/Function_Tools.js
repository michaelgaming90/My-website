export function Build_Element(Type, Parent, bool, Text_Content, Id, Element_Type, Name, Class)
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

export function Delay(ms)
{
    return new Promise((resolve, reject) =>
        {
            setTimeout(resolve,ms);
        }
    )
}

export function Add_Element(Type, parent, bool)
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

export function Get_Element(Id)
{
    return document.getElementById(Id);
}

export function Check(type)
{
    console.log(type);
}

export function Assign_Element(Element, property, value){
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

export function Remove(Element, parent, bool)
{
    parent.removeChild(Element);

    if(bool)
    {
        let brs = document.querySelectorAll(`#My_Div br`);
        let br = brs[brs.length - 1];
        parent.removeChild(br);
    } 
}

export function Save(index, property, value, Timer_Id)
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