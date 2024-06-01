const Start = document.getElementById("Start");
const Stop = document.getElementById("Stop");
const Dice_Counters = document.getElementById("Dice_Counters");
const Dice_Container = document.getElementById("Dice_Container");
const Number_Of_Dice = document.getElementById("Number_Input");

let Random_Numbers = [0, 0, 0];
let Isrunning = false;
let Interval = 0;
let Images = [];
let Container = [];

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
        for(let i = 0; i < Number_Of_Dice.value; i++)
        {
            Random_Numbers[i] = Math.floor(Math.random() * 6) +1;

            Images[0] = document.createElement("img");
            Images[0].id = `${i+1}_Dice`;
            Images[0].classList.add("Dices");

            Images[1] = document.createElement("label");
            Images[1].id = `${i+1}_Counter`;
            Images[1].classList.add("Dice_Counters");

            Dice_Container.appendChild(Images[0]);
            Dice_Counters.appendChild(Images[1]);
        }

        Container = [];
        Images = [];

        for(let i = 0; i < Number_Of_Dice.value; i++)
        {
            Container[i] = document.getElementById(`${i+1}_Counter`);
            Container[i].textContent = 0;
        }
        //Rolling Animation
        while(Isrunning)
        {
            for(let j = 0; j < 6; j++)
            {
                for(let i = 0; i < Number_Of_Dice.value; i++)
                {
                    try
                    {
                        Images[0] = document.getElementById(`${i+1}_Dice`);
                        Images[0].src = `Images/${Math.floor(Math.random() * 6) +1}_Side_Dice.png`;
                    }
                    catch(error)
                    {
                        console.error(error);
                        Add_New(Number_Of_Dice.value, (i+1));
                    }
                }
                await Delay(50);
            }
        }
        Images = [];
        Container = [];

        for(let i = 0; i < Number_Of_Dice.value; i++)
        {
            Images[0] = document.getElementById(`${i+1}_Dice`);
            Images[0].src = `Images/${Random_Numbers[i]}_Side_Dice.png`;
            Container[0] = document.getElementById(`${i+1}_Counter`);
            Container[0].textContent = Random_Numbers[i];
            
        }
        Container = [];
        Images = [];
    }
}

function Delay(ms)
{
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

function Add_New(id, less)
{
    for(let i = 0; i < (id - (less-1)); i++)
    {
        let New_Image;
        let New_Counter;
        Random_Numbers[less-1+i] = Math.floor(Math.random() * 6) +1;
    
        New_Image = document.createElement("img");
        New_Image.id = `${less+i}_Dice`;
        New_Image.classList.add("Dices");
        Dice_Container.appendChild(New_Image);
    
        New_Counter = document.createElement("label");
        New_Counter.id = `${less+i}_Counter`;
        New_Counter.classList.add("Dice_Counters");
        New_Counter.textContent = 0;
        Dice_Counters.appendChild(New_Counter);    
    }
}
