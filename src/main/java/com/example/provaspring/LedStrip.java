package com.example.provaspring;

public class LedStrip{

    public LedStrip() {
    }

    public String programColorPalette(char colorNumber, int red, int green, int blue) {

        if (!validRGBColor(red)) {
            System.out.println("errore nel comando (rosso)");
            return null;
        } else if (!validRGBColor(green)) {
            System.out.println("errore nel comando (verde)");
            return null;
        } else if (!validRGBColor(blue)) {
            System.out.println("errore nel comando (blu)");
            return null;
        }

        if (!validColorLabel(colorNumber)) {
            System.out.println("comando invalido nel carattere per il colore");
            return null;
        }

        String cmd = "X008B[1";

        cmd += colorNumber;
        cmd += getTwoDigitHexString(red);
        cmd += getTwoDigitHexString(green);
        cmd += getTwoDigitHexString(blue);
        cmd = cmd.toUpperCase();
        cmd += "]";
        return cmd;
    }

    public String programColorPalette(char colorNumber, String hexColor) {

        if (!validColorLabel(colorNumber)) {
            System.out.println("comando invalido nel carattere per il colore");
            return null;
        }

        hexColor = validHexValue(hexColor);

        String cmd = "X008B[1";

        cmd += colorNumber;
        cmd += hexColor;
        cmd = cmd.toUpperCase();
        cmd += "]";
        return cmd;
    }

    public String rampLedOut(int ledIntensity, char colorLabel, int rampTime ) {


        if (!validIntensity(ledIntensity)) {
            System.out.println("intensità non valida");
            return null;
        } else if (!validColorLabel(colorLabel)) {
            System.out.println("colore non valido");
            return null;
        } else if (!validIntensity(rampTime)) {
            System.out.println("tempo non valido");
            return null;
        }

        String cmd = "X008B[2";
        cmd += formatInt(ledIntensity);
        cmd += colorLabel;
        cmd += formatInt(rampTime);
        cmd = cmd.toUpperCase();
        cmd += "]";
        return cmd;
    }

    //0 - 255 valid color
    private boolean validRGBColor(int color) {
        return color <= 255 && color >= 0;
    }

    private boolean validIntensity(int intensity) {
        return intensity < 100 && intensity >= 0;
    }

    private String formatInt(int number) {
        if (number < 10)
            return String.format("0%d", number);
        else
            return String.valueOf(number);
    }

    private boolean validColorLabel(char colorLbl) {
        return (colorLbl == '0' || colorLbl == '1' || colorLbl == '2' || colorLbl == '3' ||
                colorLbl == '4' || colorLbl == '5' || colorLbl == '6' || colorLbl == '7' ||
                colorLbl == '8' || colorLbl == '9' || colorLbl == 'a' || colorLbl == 'b' ||
                colorLbl == 'c' || colorLbl == 'd' || colorLbl == 'e' || colorLbl == 'f' );
        //return ((colorLbl >= 48 && colorLbl <= 57) || (colorLbl >= 65 && colorLbl <= 70));
    }

    private String getTwoDigitHexString(int integer) {

        StringBuilder sb = new StringBuilder();
        sb.append(Integer.toHexString(integer));
        if (sb.length() < 2) {
            sb.insert(0, '0');
        }

        return sb.toString();

    }

    public String validHexValue(String hex) {
        //formatta correttamente
        hex = hex.replace("#", "");
        hex = hex.toUpperCase();

        //valida

        return hex;
    }

}
