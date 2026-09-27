Set WshShell = CreateObject("WScript.Shell") 
WshShell.CurrentDirectory = "C:\Users\gotti\Amanvi AI\laptop-guardian\..\backend" 
WshShell.Run "node src/index.js", 0, False 
WScript.Sleep 1500 
WshShell.CurrentDirectory = "C:\Users\gotti\Amanvi AI\laptop-guardian\..\" 
WshShell.Run "ngrok http 5000", 0, False 
WScript.Sleep 1000 
WshShell.CurrentDirectory = "C:\Users\gotti\Amanvi AI\laptop-guardian\" 
WshShell.Run "node guardian-agent.js", 0, False 
