package com.example.java.controller;

import com.example.java.dto.EchoResponse;
import com.example.java.dto.SignupRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @PostMapping(value = "/echo")
    public ResponseEntity<EchoResponse> echo() {
        System.out.println("get [echo] request from client...");

        EchoResponse res = new EchoResponse();
        res.setMsg("Hello!");
        res.setServerTime(System.currentTimeMillis());

        return ResponseEntity.ok(res);
    }

    @GetMapping(value = "/ping", produces = MediaType.TEXT_PLAIN_VALUE)
    public String ping() {
        System.out.println("get [ping] request from client...");
        return String.valueOf(System.currentTimeMillis());
    }

    @PostMapping(value = "/signup")
    public ResponseEntity signup(@Valid @RequestBody SignupRequest request) {
        System.out.println("get [signup] request from client...");

        System.out.println("New account: " + request.getEmail() + "    " + request.getNickname());

        return ResponseEntity.ok().build();
    }

}
