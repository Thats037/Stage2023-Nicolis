package com.example.provaspring;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ErrorControllerSpring implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        return "Qualcosa è andato storto! :/ <br\\> ads";
    }

    public String getErrorPath() {
        return "/error";
    }
}