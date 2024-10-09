package com.team.health_coach.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.team.health_coach.dto.AuctionItem_DTO;
import com.team.health_coach.service.AuctionService;

@Controller
@RequestMapping("/auction")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    //전체 물품 조회 GET
    @GetMapping
    public ResponseEntity<List<AuctionItem_DTO>> getAcutionItems() {
        List<AuctionItem_DTO> items = auctionService.getAllAuctionItems();
        return ResponseEntity.ok(items);
    }

    //물품 등록 POST
    @PostMapping
    public ResponseEntity<AuctionItem_DTO> createAuctionItem(
            @RequestParam("item_name") String itemName,
            @RequestParam("start_price") double startPrice,
            @RequestParam("user_num") Long userNum,
            @RequestParam("content") String content,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {

        LocalDateTime endTime = LocalDateTime.now().plusMinutes(5);  // 현재 시간 기준으로 5시간 후 // 일단 5분으로 테스트를 위해서 임의로 변경하면 됨
        
        //값을 DTO로 전달
        AuctionItem_DTO auctionItem_dto = new AuctionItem_DTO();
        auctionItem_dto.setItemName(itemName);
        auctionItem_dto.setStartPrice(startPrice);
        auctionItem_dto.setUserNum(userNum);
        auctionItem_dto.setEndTime(endTime);
        auctionItem_dto.setContent(content);
        auctionItem_dto.setImage(imageUrl);

        AuctionItem_DTO createAuction = auctionService.createAuctionItem(auctionItem_dto);
        return new ResponseEntity<>(createAuction, HttpStatus.CREATED);
    }

    // 특정 경매 물품 조회
    @GetMapping("/{auctionId}")
    public ResponseEntity<AuctionItem_DTO> getAuctionItem(@PathVariable Long auctionId) {
        AuctionItem_DTO item = auctionService.getAuctionItemById(auctionId);
        return ResponseEntity.ok(item);
    }

    // 특정 물품 입찰
    @PostMapping("/bid/{auctionId}")
    public ResponseEntity<String> placeBid(@PathVariable Long auctionId,
                                         @RequestParam double bidAmount,
                                         @RequestParam Long bidderUsername) {
        String resultMessage = auctionService.placeBid(auctionId, bidAmount, bidderUsername);
        return ResponseEntity.ok(resultMessage);
    }

    // 입찰 종료
    @PostMapping("/end/{auctionId}")
    public ResponseEntity<Void> endAuction(@PathVariable Long auctionId) {
        auctionService.endAuction(auctionId);
        return ResponseEntity.status(201).build();
    }
}
