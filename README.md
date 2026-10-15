# La mia spesa · UI 1

Una piccola Progressive Web App (PWA) per le liste della spesa.

## Funzioni incluse
- Quattro liste: Dispensa, Frigo, Freezer e Compere quotidiane.
- Sottocategorie per Dispensa, Frigo e Freezer.
- Aggiunta, eliminazione con conferma e riordino con frecce.
- Modalità spesa con spunte temporanee.
- Salvataggio automatico sul dispositivo tramite `localStorage`.
- Esportazione e importazione di un backup JSON.
- Manifest e service worker per installazione e uso offline dopo il primo caricamento.

## Come provarla
Aprire `index.html` direttamente può bastare per una prova visiva, ma installazione PWA e service worker richiedono un sito servito tramite HTTPS (o localhost).

## Pubblicarla gratuitamente con GitHub Pages
1. Crea un account GitHub, se non ne hai già uno.
2. Crea un nuovo repository pubblico, ad esempio `la-mia-spesa`.
3. Carica tutti i file e la cartella `icons` mantenendo la struttura.
4. In **Settings → Pages**, scegli la pubblicazione dal branch `main`, cartella `/ (root)`.
5. Attendi la pubblicazione e apri l'indirizzo HTTPS fornito da GitHub Pages.

## Aggiungerla alla schermata Home dell'iPhone
1. Apri il sito pubblicato con Safari.
2. Tocca **Condividi**.
3. Scegli **Aggiungi alla schermata Home**.
4. Conferma con **Aggiungi**.

## Attenzione al salvataggio
I dati sono salvati localmente nel browser e non vengono sincronizzati automaticamente con altri dispositivi. Se cancelli i dati del sito o cambi dispositivo, usa prima **Esporta backup** per conservarli. Per sincronizzazione tra dispositivi servirebbe aggiungere un backend/database.

## Aggiornamenti
Dopo aver pubblicato modifiche al codice, incrementa il nome della cache in `sw.js` (ad esempio `ui1-spesa-cache-v2`) per evitare che il service worker conservi la versione precedente.
