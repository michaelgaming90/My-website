const Start = document.getElementById("Start");
const Stop = document.getElementById("Stop");
const Dice_Counters = document.getElementById("Dice_Counters");
const Dice_Container = document.getElementById("Dice_Container");
const Number_Of_Dice = document.getElementById("Number_Input");

let Random_Numbers = [0, 0, 0];
let Images = [];
let Container = [];

Start.onclick = () =>
{
    Start_Function(Stop_Function);
}

Stop.onclick = () =>
{
    Stop_Function();
}


function Stop_Function()
{
    Add_HTML_Elements();
    for(let i = 0; i < Number_Of_Dice.value; i++)
    {
        Container[i] = document.getElementById(`${i}_Counter`);
        Container[i].textContent = Random_Numbers[i];
    }
    Container = [];
    Images = [];
}

async function Start_Function(Stop_Function)
{
    Add_HTML_Elements();
    Random_Numbers[0] = Math.floor(Math.random() * 10) +1;
    Container = [];
    Images = [];

    for(let i = 0; i < Number_Of_Dice.value; i++)
    {
        Container[i] = document.getElementById(`${i}_Counter`);
        Container[i].textContent = 0;
    }

    //Rolling Animation
    for(let k = 0; k < Random_Numbers[0]; k++)
    {
        for(let j = 0; j < 6; j++)
        {
            for(let i = 0; i < Number_Of_Dice.value; i++)
            {
                Images[0] = document.getElementById(`${i+1}_Dice`);
                Images[0].src = `Images/${Math.floor(Math.random() * 6) +1}_Side_Dice.png`;
            }
            await Delay(50);
        }
    }
    Images = [];
    Container = [];
    Stop_Function();
}

function Delay(ms)
{
    return new Promise(resolve => setTimeout((resolve), ms))
}

function Add_HTML_Elements()
{
    for(let i = 0; i < Number_Of_Dice.value; i++)
    {
        Random_Numbers[i] = Math.floor(Math.random() * 6) +1;
        Images.push(`<img id="${i+1}_Dice" src="Images/${Random_Numbers[i]}_Side_Dice.png" class="Dices" >`)
        Container.push(`<label id="${i}_Counter" class="Dice_Counters"></label>`);
    }

    //Inserts a new line of code 
    Dice_Container.innerHTML = Images.join("\n");
    Dice_Counters.innerHTML = Container.join("\n");
}