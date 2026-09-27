Set WshShell = CreateObject("WScript.Shell") 
WshShell.CurrentDirectory = "C:\Users\gotti\Amanvi AI\laptop-guardian\" 
WshShell.Run "node guardian-agent.js", 0, False 
