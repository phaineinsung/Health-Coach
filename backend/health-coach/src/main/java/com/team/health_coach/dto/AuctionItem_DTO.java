package com.team.health_coach.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AuctionItem_DTO {

    private Long auctionId;
    private String itemName;
    private Long userNum; // 판매자 번호
    private double startPrice;
    private LocalDateTime endTime;
    private String content;
    private LocalDateTime uploadDate;
    private String image;
    private Double highestBid; // 최종적으로 DB에 저장되는 최고 입찰가
    private Long highestBidder; // 최종적으로 DB에 저장되는 최고 입찰자
    private Double tempHighestBid; // Redis에서 가져온 임시 최고 입찰가
    private Long tempHighestBidder; // Redis에서 가져온 임시 최고 입찰자
    private String remainingTime; // 경매 남은 시간

    // 모든 필드를 초기화하는 생성자
    public AuctionItem_DTO(Long auctionId, String itemName, Long userNum, double startPrice, LocalDateTime endTime,
                           String content, LocalDateTime uploadDate, String image, Double highestBid,
                           Long highestBidder, Double tempHighestBid, Long tempHighestBidder, String remainingTime) {
        this.auctionId = auctionId;
        this.itemName = itemName;
        this.userNum = userNum;
        this.startPrice = startPrice;
        this.endTime = endTime;
        this.content = content;
        this.uploadDate = uploadDate;
        this.image = image;
        this.highestBid = highestBid;
        this.highestBidder = highestBidder;
        this.tempHighestBid = tempHighestBid;
        this.tempHighestBidder = tempHighestBidder;
        this.remainingTime = remainingTime;
    }
}
