//package com.financeTracking.Fintrack.Trip.Controller;
//
//import com.financeTracking.Fintrack.TransactionService.Service.TransactionService;
//import com.financeTracking.Fintrack.Trip.DTO.TripCreateRequest;
//import com.financeTracking.Fintrack.Trip.Service.TripService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/trip")
//public class TripController {
//
//    @Autowired
//    public TripService tripService;
//
//    @PostMapping("/add")
//    public ResponseEntity<String> createNewTrip(@RequestBody TripCreateRequest request){
//        String newTrip = tripService.createNewTrip(request);
//        return ResponseEntity.ok(newTrip);
//    }
//}
