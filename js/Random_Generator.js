const Start = document.getElementById("Start");
const Stop = document.getElementById("Stop");

const Div = document.getElementById("Div");
const Dice_Counters = document.getElementById("Dice_Counters");
const Dice_Container = document.getElementById("Dice_Container");
const Number_Of_Dice = document.getElementById("Number_Input");

let Holder_Number_Of_Dice = Number_Of_Dice.value;
let Random_Numbers = [];
let Id = 0;
let Isrunning = false;
let Interval = 0;
let Images = [];
let Container = [];

document.addEventListener("keyup", 
    event => { 
        switch(event.code)
        {
            case "Space":
                if(!Isrunning) 
                {
                    Start_Function(); 
                }
                else
                {
                    Isrunning = false;
                }
            break;
        }    
        //console.log(event.target);
        event.preventDefault();
    }
);

Start.onclick = () =>
{
    Start_Function();
}

Stop.onclick = () =>
{
    Isrunning = false;
}

async function Start_Function()
{
    
    if(!Isrunning)
    {
        Isrunning = true;

        Dice_Container.innerHTML = "";
        Dice_Counters.innerHTML = "";

        //Initialization
        
        //Rolling Animation
        while(Isrunning)
        {
            for(let i = 0; i < Number_Of_Dice.value; i++)
            {
                try
                {
                    if(Number_Of_Dice.value === Holder_Number_Of_Dice)
                    {
                        setTimeout(Delete(i+1), 5000);
                        Add_New(i+1);
                        Random_Numbers[i] = Math.floor(Math.random() * 6) +1;

                        Images[0] = document.getElementById(`${i+1}_Dice${Id+1}`);
                        Images[0].src = `Images/${Random_Numbers[i]}_Side_Dice.png`;
                    
                        Container[0] = document.getElementById(`${i+1}_Counter`);
                        Container[0].textContent = Random_Numbers[i];
                    }
                    else if(Number(Number_Of_Dice.value) < Number(Holder_Number_Of_Dice))
                    {
                        Dice_Container.innerHTML = "";
                        Dice_Counters.innerHTML = "";

                        //Initialization
                        Add_New(1);
                    }
                    if(i === 0)
                    {
                        Holder_Number_Of_Dice = Number_Of_Dice.value;
                    }
                }
                catch(error)
                {
                    console.log(error);
                    Add_New((i+1));
                    Holder_Number_Of_Dice = Number_Of_Dice.value;
                }
                }
            await Delay(250);
            Id++;  
        }
        

        const Final_Result = document.createElement("label");
        Final_Result.textContent = Random_Numbers.reduce((number, currentvalue) => number + currentvalue, 0);
        Final_Result.id = "Final_Result";

        if(Div.contains(Final_Result))
        {
            Div.removeChild(Final_Result);
        }

        Div.insertBefore(Final_Result, Start);
        console.log(Final_Result.textContent);
        

        Random_Numbers = [];
        Images = [];
        Container = [];
        Interval = 0;
    }
}

function Delay(ms)
{
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

function Add_New(less)
{
    for(let i = 0; i < (Number_Of_Dice.value - (less-1)); i++)
    {
        Interval++;

        let New_Image;
        let New_Counter;
        let breaK_line;

        breaK_line = document.createElement("br");
        Random_Numbers[less-1+i] = Math.floor(Math.random() * 6) +1;
    
        New_Image = document.createElement("img");
        New_Image.id = `${less+i}_Dice${Id+1}`;
        New_Image.classList.add("Dices");
        Dice_Container.appendChild(New_Image);
    
        New_Counter = document.createElement("label");
        New_Counter.id = `${less+i}_Counter`;
        New_Counter.classList.add("Dice_Counters");
        New_Counter.textContent = 0;
        Dice_Counters.appendChild(New_Counter); 

        if(Interval % 9 === 8)  
        {
            Dice_Counters.appendChild(breaK_line);
        }
    }
}

function Delete(id)
{
    const Delete_Img = document.getElementById(`${id}_Dice${Id}`);
    console.log(window.getComputedStyle(Delete_Img).transform);

    Delete_Img.transform = "rotateX(45deg)";
    //Dice_Container.removeChild(Delete_Img);

    const Delete_Container = document.getElementById(`${id}_Counter`);
    Dice_Counters.removeChild(Delete_Container);
}