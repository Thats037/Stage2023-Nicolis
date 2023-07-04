package com.example.provaspring;

import com.fazecast.jSerialComm.SerialPort;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BoardComm implements Runnable {

    SerialPort serialPort = null;

    private String rotaryButton = "", presenceSensor = "", rfidSensor = "", RfidSensList = "", presenceSensorList = "";

    //presence sensor regex
    private final Pattern regexPresenceSensor = Pattern.compile("Dz=(\\d+|AB|XX)", Pattern.CASE_INSENSITIVE);

    //rotary button regex
    private final Pattern regexRotaryButton = Pattern.compile("Dr=(\\d+)", Pattern.CASE_INSENSITIVE);
    private Matcher selection;


    public BoardComm(SerialPort serialPort) {
        this.serialPort = serialPort;
        //inizializza serialPort
        serialPort.openPort();
        serialPort.setBaudRate(115200);
        serialPort.setParity(SerialPort.NO_PARITY);
        serialPort.setNumDataBits(8);
        serialPort.setNumStopBits(1);
        serialPort.setFlowControl(SerialPort.NO_PARITY);
    }

    @Override
    public void run() {

        try {
            String bufferString = "";
            while (true)
            {

                while (serialPort.bytesAvailable() == -1) {
                    System.out.println("la serialPort seriale non è stata aperta correttamente! [nuovo tentativo in 1s]");
                    Thread.sleep(1000);
                    serialPort.openPort();
                }

                while (serialPort.bytesAvailable() == 0) {
                    Thread.sleep(200);
                }
                byte[] readBuffer = new byte[serialPort.bytesAvailable()];
                int numRead = serialPort.readBytes(readBuffer, readBuffer.length);
                bufferString = byteToString(readBuffer);
                System.out.println("Read " + numRead + " bytes.");
                System.out.println("byte To String: " + bufferString);



                String arr[] = bufferString.split("\n");

                for (int i = 0; i < arr.length; i++) {
                    if (arr[i].contains("X005B[Dz="))
                        presenceSensor = arr[i];

                    if (arr[i].contains("XR[P")) {
                        rfidSensor = arr[i];
                        String rfidArr[] = rfidSensor.split("\n");
                        for (int j = 0; j < rfidArr.length; j++) {
                            if (rfidArr[j].contains("XR[PB001]"))
                                RfidSensList += "1D-";

                            if (rfidArr[j].contains("XR[PU001]"))
                                RfidSensList += "1U-";

                            if (rfidArr[j].contains("XR[PB002]"))
                                RfidSensList += "2D-";

                            if (rfidArr[j].contains("XR[PU002]"))
                                RfidSensList += "2U-";
                        }
                    }

                    if (arr[i].contains("X001A")) {
                        String[] comandi = bufferString.split("\n");
                        for (int j = 0; j < comandi.length; j++)
                            inviaComando(comandi[j]);
                    }

                    if (arr[i].contains("X002B[Dr=")) {
                        rotaryButton = arr[i];
                    }
                }



                //Thread.sleep(100);
            }
        } catch (Exception e) { e.printStackTrace(); }
        serialPort.closePort();
    }

    public void inviaComando(byte[] buffer) {
        serialPort.writeBytes(buffer, buffer.length);
    }

    private String byteToString(byte[] buffer) {
        String s = "";
        for (int i = 0; i < buffer.length; i++)
            s += (char)buffer[i];
        return s;
    }

    private byte[] stringToByte(String stringa) {
        byte[] buffer = new byte[stringa.length()];
        for (int i = 0; i < buffer.length; i++)
            buffer[i] = (byte)stringa.charAt(i);
        return buffer;
    }


    public String getPresenceSensor() {
        //X005B[Dz=09]

        String cmdNumbers = "";
        Matcher selection = regexPresenceSensor.matcher(presenceSensor);

        if (selection.find())
            cmdNumbers = selection.group(0);

        cmdNumbers = cmdNumbers.replace("Dz=", "");

        return  presenceSensorList += cmdNumbers + "-";
    }

    public String getRfidSensor() {

        String rfidArr[] = rfidSensor.split("\n");
        //RfidSensList


        return RfidSensList;
    }

    public String getRotary() {
        String cmdNumbers = "";

        selection = regexRotaryButton.matcher(rotaryButton);

        if (selection.find())
            cmdNumbers = selection.group(0);

        cmdNumbers = cmdNumbers.replace("Dr=", "");

        return cmdNumbers;
    }

    public void inviaComando(String cmd) {
        cmd += "\n";

        if (cmd.contains("X001A[17]"))
            cmd = "X001A[192]\r\n";

        else if (cmd.contains("X001A[19]"))
            cmd = "X001A[255]\r\n";

        byte[] buffer = stringToByte(cmd);
        inviaComando(buffer);
    }

    public void setRfidSensor(String rfidSensor) {
        this.RfidSensList = rfidSensor;
    }

    public void setPresenceSensorList(String presenceSensorList) {
        this.presenceSensorList = presenceSensorList;
    }
}
