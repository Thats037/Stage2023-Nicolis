package com.example.provaspring;

import org.springframework.ui.Model;

import java.util.Collection;
import java.util.Map;

public class ManageCommands {
    private LedStrip ledController = new LedStrip();

    public LedStrip getLedController() {
        return ledController;
    }

}
