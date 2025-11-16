# Task-planning-web-app
Proiect TW — Echipa 404found  
Platformă web pentru gestionarea task-urilor într-o echipă de Support & IT Operations

## Descriere generală
Acest proiect reprezintă o aplicație web de tip Single Page Application (SPA), realizată în React, destinată gestionării activităților dintr-o echipă modernă de Support & IT Operations.  
Platforma permite crearea, alocarea și monitorizarea task-urilor de suport tehnic interne, utilizate frecvent în companii pentru gestionarea solicitărilor angajaților.

Proiect realizat de echipa 404found:
- Selea Rares Mihail  
- Voicu Ioana Delia  
- Ciobanu Matei Daniel  

## Obiectiv
Scopul aplicației este de a oferi un sistem centralizat prin care activitatea unei echipe de IT Support poate fi organizată eficient. Managerii pot crea și aloca task-uri către specialiști, iar progresul acestora poate fi urmărit printr-un flux de lucru bine definit.

## Domeniu de utilizare
Platforma este concepută pentru:
- echipe interne de IT Support  
- echipe de IT Operations într-o companie  
- echipe DevOps

## Exemple de task-uri gestionate de aplicație
- Configurarea unui laptop nou pentru onboarding  
- Crearea unui cont în servicii interne  
- Resetarea accesului VPN  
- Investigarea unui incident software  
- Înlocuirea unui echipament defect (mouse, tastatură, docking station)  
- Instalarea unui software intern  
- Verificarea unui ticket de securitate  
- Dezactivarea accesului pentru un angajat (offboarding)

## Rolurile utilizatorilor

### Administrator
- Creează și gestionează conturi de utilizatori  
- Atribuie roluri: IT Manager sau IT Specialist  
- Gestionează structura organizațională  

### IT Manager
- Creează un task cu descriere completă  
- Starea inițială a unui task este OPEN  
- Alocă task-ul unui specialist, modificând starea în PENDING  
- Vizualizează toate task-urile și starea lor  
- Marchează un task finalizat ca fiind CLOSED  
- Consultă istoricul complet al task-urilor pentru orice specialist  

### IT Specialist (Executor)
- Vizualizează lista de task-uri asignate  
- Marchează un task ca finalizat, schimbându-l în COMPLETED  
- Consultă istoricul personal al task-urilor  

## Stările unui task

| Stare       | Descriere                                             |
|-------------|-------------------------------------------------------|
| OPEN        | Task creat de manager, nealocat                       |
| PENDING     | Task alocat unui specialist                           |
| COMPLETED   | Specialistul a finalizat task-ul                      |
| CLOSED      | Managerul validează finalizarea și închide task-ul    |

## Funcționalități principale
- Autentificare și gestionare utilizatori  
- Dashboard diferit pentru Manager și Specialist  
- Crearea și editarea task-urilor (Manager)  
- Alocarea task-urilor (Manager)  
- Marcarea task-urilor ca finalizate (Specialist)  
- Filtrare și căutare task-uri  
- Istoric complet pentru fiecare utilizator 
