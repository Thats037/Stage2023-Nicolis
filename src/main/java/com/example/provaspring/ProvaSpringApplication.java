package com.example.provaspring;

import com.fazecast.jSerialComm.SerialPort;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

@SpringBootApplication
@RestController
public class ProvaSpringApplication {

    private final ManageCommands managar = new ManageCommands();

    private static String hexNum = "";
    private static final BoardComm board = new BoardComm(SerialPort.getCommPort("COM3"));
    private char colorNum = '0';
    private String hexValue = "FFFFFF";
    private int lightIntensity = 50;

    public static void main(String[] args) {
        SpringApplication.run(ProvaSpringApplication.class, args);
        startBoard();
    }

    @GetMapping("/hello")
    public String sayHello(@RequestParam(value = "myName", defaultValue = "Persona") String name) {
        return String.format("Ciao %s!   %s", name);
    }

    @PostMapping("/sliderValue")
    public void sliderValue(@RequestParam int value) {
        lightIntensity = value;
        String formattedValue = value + "";
        if (value < 10)
            formattedValue = "0" + value;
        ProvaSpringApplication.getBoard().inviaComando("X008B[2" + formattedValue + colorNum + "05]\r");
        //managar.getRotaryButton().pickNumber();
    }

    @PostMapping("/saveColor")
    public void saveColor() {
        String cmd = managar.getLedController().programColorPalette(colorNum, hexValue);
        ProvaSpringApplication.getBoard().inviaComando( cmd + "\r");
    }

    @PostMapping("/loadColor")
    public void loadColor() {

        String cmd = managar.getLedController().rampLedOut(lightIntensity, colorNum, 5);
        board.inviaComando(cmd + "\r");
    }

    @PostMapping("/saveAndSetColor")
    public void saveAndSetColor() {
        saveColor();
        try {
            Thread.sleep(400);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        String cmd = managar.getLedController().rampLedOut(lightIntensity, colorNum, 5);
        board.inviaComando(cmd + "\r");
    }

    @PostMapping("/numSlot")
    public void numSlot(@RequestParam int value) {
        colorNum = Integer.toHexString(value).charAt(0);
        //ProvaSpringApplication.getBoard().inviaComando("X008B[2" + colorNum + "005]\r");
    }

    @PostMapping("/hexValue")
    public void hexValue(@RequestParam String string) {
        //programma luce
        //hexValue = valore hex
        hexValue = managar.getLedController().validHexValue(string);
    }

    @PostMapping("/setRgbFlash")
    public void setRgbFlash() {
        board.inviaComando("X008B[4991065319930018]\r");
    }

    @GetMapping("/rotaryToPage")
    public String rotaryToPage() {
        return board.getRotary();
    }

    @GetMapping("/presenceSensorToPage")
    public String presenceSensorToPage() {
        String presence = board.getPresenceSensor();
        resetPresenceSensor();
        return presence;
    }

    @GetMapping("/rfidToPage")
    public String rfidToPage() {
        String rfid = board.getRfidSensor();
        resetRfid();
        return rfid;
    }

    @PostMapping("/resetRfid")
    public void resetRfid() {
        board.setRfidSensor("");
    }

    @PostMapping("/resetPresenceSensor")
    public void resetPresenceSensor() {
        board.setPresenceSensorList("");
    }

    private static void startBoard() {
        Thread th = new Thread(board);
        th.start();
    }

    public static BoardComm getBoard() {
        return board;
    }
}

