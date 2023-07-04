

let oldValueRotary, oldValuePresence;

let stopPollingRotary = false, stopPollingPresenceSensor = false, stopPollingRfid = false, scen5RealTimecheck = false;

let scene = 0; // 0 debug, scen 1, scen 2, scen 3 ...

let lastRfid1 = "", lastRfid2 = "";
// var scenario 4
let peopleWalkedIn = 0, checkOutIndex = 0, lastRfidCheckOut = 0;

//var scenario 5
let imageSelector = 0;

window.onload = function () {

    document.getElementById("stopPollingCheckbox").addEventListener("change", function() {
        stopPollingRotary = this.checked;
    });

    document.getElementById("stopPollingCheckboxPresence").addEventListener("change", function() {
        stopPollingPresenceSensor = this.checked;
    });

    document.getElementById("stopPollingRfid").addEventListener("change", function() {
        stopPollingRfid = this.checked;
    });

    document.getElementById("realTimeSelector").addEventListener("change", function() {
        scen5RealTimecheck = this.checked;
    });
}

function scenaryDebug() {
    stopPollingPresenceSensor = false;
    stopPollingRotary = false;
    stopPollingRfid = false;
    scene = 0;

}
function scenary1() {
    document.getElementById("scen1Img1").innerHTML = "";
    document.getElementById("scen1Img2").innerHTML = "";
    document.getElementById("scen1Desc1").innerHTML = "";
    document.getElementById("scen1Desc2").innerHTML = "";
    stopPollingPresenceSensor = true;
    stopPollingRotary = true;
    stopPollingRfid = false;
    scene = 1;

    if (lastRfid1 === "1D")
        setScen1El1(false);
    if (lastRfid2 === "2D")
        setScen1El2(false);
    if (lastRfid1 === "1U")
        setScen1El1(true);
    if (lastRfid2 === "2U")
        setScen1El2(true);

}

function scenary2() {
    document.getElementById("scen2Img1").innerHTML = "";
    document.getElementById("scen2Img2").innerHTML = "";
    document.getElementById("scen2Desc1").innerHTML = "";
    document.getElementById("scen2Desc2").innerHTML = "";
    stopPollingPresenceSensor = true;
    stopPollingRotary = true;
    stopPollingRfid = false;
    scene = 2;

    if (lastRfid1 === "1D")
        setScen2El1(true);
    if (lastRfid2 === "2D")
        setScen2El2(!false);
    if (lastRfid1 === "1U")
        setScen2El1(!true);
    if (lastRfid2 === "2U")
        setScen2El2(!true);

}

function scenary3() {
    stopPollingPresenceSensor = false;
    stopPollingRotary = true;
    stopPollingRfid = true;
    scene = 3;

    setScen3(oldValuePresence);
    document.getElementById("scen3Txt2").innerHTML = oldValuePresence;

}

function scenary4() {
    stopPollingRotary = true;
    stopPollingRfid = false;
    stopPollingPresenceSensor = false;
    scene = 4;

    setScen4Color("#FFFFFF");
    document.getElementById("peopleJoin").innerHTML = peopleWalkedIn;

}

function scenary5() {
    stopPollingRotary = false;
    stopPollingRfid = true;
    stopPollingPresenceSensor = true;

    imageSelector = 0;
    scene = 5;

}
function restartScene4() {
    peopleWalkedIn = 0;
    checkOutIndex = 0;
    setScen4Color("#FFFFFF");
    document.getElementById("peopleJoin").innerHTML = "~ " + peopleWalkedIn;

    document.getElementById("scannedProduct").innerHTML = "";
    document.getElementById("checkOutTextArea").value = ("");
}

function startPolling() {
    return setInterval(function () {

        if (!stopPollingRotary) {


            $.ajax({
                type: "GET",
                url: "/rotaryToPage",
                success: function (data) {
                    if (scene === 0) {
                        console.log(data + " --- " + oldValueRotary);
                        if (data != oldValueRotary && oldValueRotary != null) {
                            console.log(data);
                            document.getElementById("rotaryTextArea").value += ("Valore rotary button: " + data + "\n");
                            let textarea = document.getElementById('rotaryTextArea');
                            textarea.scrollTop = textarea.scrollHeight;
                        }
                    }

                    if (scene === 5) {
                        if (data != oldValueRotary && oldValueRotary != null) {
                            if (Number(data) >= 10)
                                data -= 10;

                            let imgName = "imgs/img" + Number(data) + ".jpg";
                            imageSelector = Number(data);
                            document.getElementById("imgSelector").src = imgName;

                            if (scen5RealTimecheck)
                                setScen5Color(Number(oldValueRotary));
                        }
                    }
                    oldValueRotary = data;
                }
            });

        }

        if (!stopPollingPresenceSensor) {
            $.ajax({
                type: "GET",
                url: "/presenceSensorToPage",
                success: function (data) {
                    //console.log(data + " --- " + oldValuePresence);

                    let arr = data.split('-');
                    for (let i = 0; i < arr.length; i++) {
                        if ((arr[i] !== "" && arr[i] != null)) {
                            if (scene === 0) {
                                if (data != oldValuePresence && oldValuePresence != null && arr[i] !== oldValuePresence) {
                                    //console.log(arr[i]);
                                    document.getElementById("presenceSensorTextArea").value += ("Valore sensore di presenza: " + arr[i] + "\n");
                                    let textarea = document.getElementById('presenceSensorTextArea');
                                    textarea.scrollTop = textarea.scrollHeight;
                                }
                            }

                            if (scene === 3) {
                                if (data != oldValuePresence && oldValuePresence != null && arr[i] !== oldValuePresence){
                                    document.getElementById("scen3Txt2").innerHTML = arr[i];
                                    setScen3(arr[i]);
                                }
                            }

                            if (scene === 4) { // todo      il sensore di presenza non è il top, sarebbe meglio quello ad infrarossi per captare le persone che passano
                                if (data != oldValuePresence && oldValuePresence != null && arr[i] !== oldValuePresence){
                                    if (arr[i] < 6 || arr[i] === "AB") {
                                        setScen4Color("#00FF00");
                                        console.log("persona passata");

                                        peopleWalkedIn++;
                                        document.getElementById("peopleJoin").innerHTML = "~ " + peopleWalkedIn;
                                    } else {
                                        setScen4Color("#FFFFFF");
                                    }
                                }
                            }

                            console.log("arr " + i + ": " + arr[i] + " oldValue: " + oldValuePresence);
                            oldValuePresence = arr[i];
                        }
                    }


                }
            });
        }

        if (!stopPollingRfid) {
            $.ajax({
                type: "GET",
                url: "/rfidToPage",
                success: function (data) {

                    console.log(data);

                    let arr = data.split('-');
                    if (scene === 0) {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] === "1D") {
                                document.getElementById("rfid1").innerHTML = "Sensore 1 Posizionato";
                                lastRfid1 = arr[i];

                            } else if (arr[i] === "2D") {
                                document.getElementById("rfid2").innerHTML = "Sensore 2 Posizionato";
                                lastRfid2 = arr[i];

                            } else if (arr[i] === "1U") {
                                document.getElementById("rfid1").innerHTML = "Sensore 1 Alzato";
                                lastRfid1 = arr[i];

                            } else if (arr[i] === "2U") {
                                document.getElementById("rfid2").innerHTML = "Sensore 2 Alzato";
                                lastRfid2 = arr[i];

                            }
                        }
                    }

                    if (scene === 1) {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] === "1D") {
                                setScen1El1(false);
                                lastRfid1 = arr[i];
                            } else if (arr[i] === "2D") {
                                setScen1El2(false);
                                lastRfid2 = arr[i];
                            } else if (arr[i] === "1U") {
                                setScen1El1(true);
                                lastRfid1 = arr[i];
                            } else if (arr[i] === "2U") {
                                setScen1El2(true);
                                lastRfid2 = arr[i];
                            }
                            console.log("i = " + arr[i]);
                        }
                    }

                    if (scene === 2) {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] === "1D") {
                                setScen2El1(!false);
                                lastRfid1 = arr[i];
                            } else if (arr[i] === "2D") {
                                setScen2El2(!false);
                                lastRfid2 = arr[i];
                            } else if (arr[i] === "1U") {
                                setScen2El1(!true);
                                lastRfid1 = arr[i];
                            } else if (arr[i] === "2U") {
                                setScen2El2(!true);
                                lastRfid2 = arr[i];
                            }
                            console.log("i = " + arr[i]);
                        }
                    }

                    if (scene === 4) {
                        for (let i = 0; i < arr.length; i++) {


                            if (arr[i] === "1D") {
                                lastRfid1 = arr[i];
                                checkOutIndex++;
                                document.getElementById("scannedProduct").innerHTML = "Prodotto 1 scannerizzato";
                                document.getElementById("checkOutTextArea").value += ("Prodotto 1 scannerizzato" + "\n");
                                document.getElementById("scannedProduct").style.color = "#2d2dce";
                                lastRfidCheckOut = 1;
                            } else if (arr[i] === "2D") {
                                lastRfid2 = arr[i];
                                checkOutIndex++;
                                document.getElementById("scannedProduct").innerHTML = "Prodotto 2 scannerizzato";
                                document.getElementById("checkOutTextArea").value += ("Prodotto 2 scannerizzato" + "\n");
                                document.getElementById("scannedProduct").style.color = "#ff5900";
                                lastRfidCheckOut = 2;
                            } else if (arr[i] === "1U") {
                                lastRfid1 = arr[i];
                            } else if (arr[i] === "2U") {
                                lastRfid2 = arr[i];
                            }

                            let textarea = document.getElementById('checkOutTextArea');
                            textarea.scrollTop = textarea.scrollHeight;


                            /// WIN
                            if (peopleWalkedIn >= 3 && checkOutIndex >= 3) {
                                document.getElementById("winProduct").innerHTML = "<h3>Hai vinto il Prodotto " + lastRfidCheckOut + "</h3>";
                                $.post('setRgbFlash');
                            }
                        }
                    }
                }
            });
        }

    }, 500);
}

function equalsOldValue(arr, oldValue) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === oldValue)
            return true;
    }
    return false;
}

function setScen1El1(empty) {
    if (empty) {
        document.getElementById("scen1Img1").innerHTML = "";
        document.getElementById("scen1Desc1").innerHTML = "";
        return;
    }

    document.getElementById("scen1Img1").innerHTML = "<img src=\"vite_duoPower8s.jpg\" alt=\"vite 1\"/>";
    document.getElementById("scen1Desc1").innerHTML = "<h1 class=\"mdc-typography--headline5\">Vantaggi</h1>\n" +
        "Due componenti per valori di carico più elevati e funzionamento intelligente (espansione, piegatura, annodamento) in funzione del materiale di supporto.\n" +
        "Il miglior feedback possibile nel serraggio. E' possibile percepire con certezza quando il fissaggio è installato perfettamente.\n" +
        "La ridotta lunghezza del fissaggio assicura un'installazione veloce senza forature profonde.\n" +
        "Il collare sottile del fissaggio impedisce lo slittamento dentro al foro.\n" +
        "Le alette anti-rotazione ravvicinate impediscono la rotazione nel foro durante l'installazione.";
}

function setScen1El2(empty) {
    if (empty){
        document.getElementById("scen1Img2").innerHTML = "";
        document.getElementById("scen1Desc2").innerHTML = "";
        return;
    }

    document.getElementById("scen1Img2").innerHTML = "<img src=\"vite_FBNii8-10.jpg\" alt=\"vite 2\"/>";
    document.getElementById("scen1Desc2").innerHTML = "<h1 class=\"mdc-typography--headline5\">Vantaggi</h1>\n" +
        "Certificato per applicazioni strutturali (marcatura CE Opzione 7 per calcestruzzo non fessurato secondo ETA 07/0211).\n" +
        "Specificamente studiato per applicazioni in ambienti asciutti e non inquinati.\n" +
        "A partire da M8 è possibile sfruttare la doppia profondità di ancoraggio certificata (hef,stand o hef,red) in funzione dello spessore dell’elemento da fissare (fino a tfix,max) o dei carichi da garantire (kNMAX=hef,stand o kNmin=hef,red).\n" +
        "Le elevate prestazioni a trazione in calcestruzzo non fessurato permettono un minor numero di punti di fissaggio e di conseguenza piastre con dimensioni più piccole.\n" +
        "La lunga filettatura permette di fissare oggetti di vario spessore e permette l'eventuale installazione distanziata, permettendo anche le regolazioni fuori piombo.\n" +
        "L’installazione passante notevolmente semplice è molto veloce grazie ai pochi colpi di martello e al ridotto numero di giri di chiave richiesti dall’ancorante per raggiungere la coppia richiesta.\n" +
        "L'estremità dell'ancorante protegge la filettatura dai danni, assicurando un'installazione (e un eventuale smontaggio) dell'oggetto da fissare più rapido."

}

function setScen2El1(empty) {
    if (empty) {
        document.getElementById("scen2Img1").innerHTML = "";
        document.getElementById("scen2Desc1").innerHTML = "";
        return;
    }

    document.getElementById("scen2Img1").innerHTML = "<img src=\"vite_duoPower8s.jpg\" alt=\"vite 1\"/>";
    document.getElementById("scen2Desc1").innerHTML = "<h1 class=\"mdc-typography--headline5\">Vantaggi</h1>\n" +
        "Due componenti per valori di carico più elevati e funzionamento intelligente (espansione, piegatura, annodamento) in funzione del materiale di supporto.\n" +
        "Il miglior feedback possibile nel serraggio. E' possibile percepire con certezza quando il fissaggio è installato perfettamente.\n" +
        "La ridotta lunghezza del fissaggio assicura un'installazione veloce senza forature profonde.\n" +
        "Il collare sottile del fissaggio impedisce lo slittamento dentro al foro.\n" +
        "Le alette anti-rotazione ravvicinate impediscono la rotazione nel foro durante l'installazione.";
}

function setScen2El2(empty) {
    if (empty){
        document.getElementById("scen2Img2").innerHTML = "";
        document.getElementById("scen2Desc2").innerHTML = "";
        return;
    }

    document.getElementById("scen2Img2").innerHTML = "<img src=\"vite_FBNii8-10.jpg\" alt=\"vite 2\"/>";
    document.getElementById("scen2Desc2").innerHTML = "<h1 class=\"mdc-typography--headline5\">Vantaggi</h1>\n" +
        "Certificato per applicazioni strutturali (marcatura CE Opzione 7 per calcestruzzo non fessurato secondo ETA 07/0211).\n" +
        "Specificamente studiato per applicazioni in ambienti asciutti e non inquinati.\n" +
        "A partire da M8 è possibile sfruttare la doppia profondità di ancoraggio certificata (hef,stand o hef,red) in funzione dello spessore dell’elemento da fissare (fino a tfix,max) o dei carichi da garantire (kNMAX=hef,stand o kNmin=hef,red).\n" +
        "Le elevate prestazioni a trazione in calcestruzzo non fessurato permettono un minor numero di punti di fissaggio e di conseguenza piastre con dimensioni più piccole.\n" +
        "La lunga filettatura permette di fissare oggetti di vario spessore e permette l'eventuale installazione distanziata, permettendo anche le regolazioni fuori piombo.\n" +
        "L’installazione passante notevolmente semplice è molto veloce grazie ai pochi colpi di martello e al ridotto numero di giri di chiave richiesti dall’ancorante per raggiungere la coppia richiesta.\n" +
        "L'estremità dell'ancorante protegge la filettatura dai danni, assicurando un'installazione (e un eventuale smontaggio) dell'oggetto da fissare più rapido."

}

function setScen3(data) {

    console.log("dist"+data);
    let element = document.getElementById("dist"+data);

    let color = "ffffff";

    switch (data) {
        case "AB": color = "#FFFFFF"; break;
        case "01": color = "#00C4F0"; break;
        case "02": color = "#00F0A1"; break;
        case "03": color = "#01F01D"; break;
        case "04": color = "#A7F000"; break;
        case "05": color = "#EFEC00"; break;
        case "06": color = "#F0A300"; break;
        case "07": color = "#EF6C00"; break;
        case "08": color = "#FF0000"; break;
        case "09": color = "#FF00CA"; break;
        case "10": color = "#C300FF"; break;
        case "XX": color = "#000000"; break;
        default: color = "#FFFFFF";
            break;
    }
    console.log(color);
    $.post('/numSlot', { value: 16 });
    $.post('/hexValue', { string: color });
    $.post('/saveAndSetColor');
}

function setScen4Color(color) {
    $.post('/numSlot', { value: 15 });
    $.post('/hexValue', { string: color });
    $.post('/saveAndSetColor');
}

function setScen5ClickSave() {
    setScen5Color(Number(oldValueRotary));
}

function setScen5Color(color) {
    switch (color) {
        case 1: color = "#00C4F0"; break;
        case 2: color = "#00F0A1"; break;
        case 3: color = "#01F01D"; break;
        case 4: color = "#A7F000"; break;
        case 5: color = "#EFEC00"; break;
        case 6: color = "#F0A300"; break;
        case 7: color = "#EF6C00"; break;
        case 8: color = "#FF0000"; break;
        case 9: color = "#FF00CA"; break;
        case 0: color = "#C300FF"; break;
        case 10: color = "#2D2DCE"; break;
    }
    $.post('/numSlot', { value: 14 });
    $.post('/hexValue', { string: color });
    $.post('/saveAndSetColor');
}

let poll = startPolling();

function getSliderValue(value) {
    console.log(value);
    console.log("X008B[2" + value + "005]");
    $.post('/sliderValue', { value : value });
    document.getElementById("hexCmdSent").innerHTML = value;

}

