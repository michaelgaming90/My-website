import {Build_Element, Delay, Add_Element, Get_Element, Check, Assign_Element, Remove, Save} from "./Function_Tools.js";

export function Update(Display, Container, Active_Tasks, milliseconds, Timer_Id, Update_Interval)
{
    if(milliseconds <= 0)
    {
        clearInterval(Update_Interval);
        Active_Tasks.style.backgroundColor = "red";

        let Read = JSON.parse(localStorage.getItem("Data"));

        let Audio = document.getElementById(`Audio_${Timer_Id}`);
        if(Audio === null && Read[0].Active_Task[Timer_Id])
        {
            Save(0, "Score", 2, Timer_Id);

            let audio = Add_Element("audio", Container, false);
            audio.classList = "Audios";
            audio.id = `Audio_${Timer_Id}`;
            audio.loop = true;
            audio.src = "../../audio/civil-defense-siren-128262.mp3";
            audio.play();

            Assign_Element(Active_Tasks, "textContent", "Finished");
            Save(0, "Current_Task_2", "Finished", Timer_Id);
            Save(0, "Active_Task_2", false, Timer_Id);
            Speech_Function(Timer_Id);
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
        Save(0, "Timer_2", milliseconds, Timer_Id);
        Assign_Element(Display, "textContent", `${minutes}:${sec}:${mil}`);
    }
}

export function Filter()
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

export function Reset()
{
    let Save_Data = JSON.parse(localStorage.getItem("Data"));

    Save_Data[0].Current_Task = [];
    Save_Data[0].Timer = [];
    Save_Data[0].Active_Task = [];
    let str = JSON.stringify(Save_Data);
    localStorage.setItem("Data", str);
}

export function Lock()
{
    let Lock = Build_Element("button", document.body, false, "🔏- Locked", "Lock", null, null, null);
    Lock.addEventListener("click", ()=>
    {
        if(Lock.textContent === "🔏- Locked")
        {
            Assign_Element(Lock, "textContent", "🔓- Unlocked");
            Lock.style.color = "red";
        }
        else
        {
            Assign_Element(Lock, "textContent", "🔏- Locked");
            Lock.style.color = "chartreuse";
        }
    })
    return Lock;
}

export function Speech_Function(Timer_Id)
{
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if('SpeechRecognition' in window)
    {
        const Speech = new SpeechRecognition();
        
        Speech.lang = "en-US";
        Speech.interimResult = false;
        Speech.maxAlternatives = 1;
        
        let Listening_State = true;
        Speech.start();
        
        Speech.onend = () =>
        {
            Check("Speech Restarted");
            Listening_State? Speech.start(): Speech.stop();
        }

        Speech.onresult = (event) => 
        {
            const transcript = event.results[0][0].transcript;
            if(transcript.includes("stop"))
            {
                let Button = document.querySelectorAll(".Start_Buttons");
                let Divs = document.querySelectorAll(".Grid_Items");
                Assign_Element(Button[Timer_Id], "textContent", "Start");
                            
                Button[Timer_Id].style.backgroundColor = "cyan";
                let Audio = document.getElementById(`Audio_${Timer_Id}`);
                if(Audio !== null)
                {
                    Audio.pause();
                    Remove(Audio, Divs[Timer_Id], false);
                }

                Speech.stop();
                Listening_State = false;
            }
            Check(transcript);
        };
    }
}
