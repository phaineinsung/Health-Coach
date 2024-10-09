package com.team.health_coach.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "AuctionItem")
public class AuctionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_id")
    private Long auctionId;

    @Column(name = "item_name")
    private String itemName; // 등록한 상품 이름

    @ManyToOne
    @JoinColumn(name = "user_num")
    private User user; // 판매자 

    @Column(name = "start_price")
    private double startPrice; // 판매자가 등록한 시작 금액

    @Column(name = "end_time")
    private LocalDateTime endTime; // 경매 종료 시간

    @Column(name = "highest_bid")
    private Double highestBid; // 입찰 금액

    @ManyToOne
    @JoinColumn(name = "highest_bidder")
    private User highestBidder; // 최고 입찰자

    @Column(name = "upload_date")
    private LocalDateTime uploadDate; // 게시글 생성 날짜

    @Column(name = "content")
    private String content; // 상품 설명

    @Column(name = "image")
    private String image;  // 등록된 이미지의 경로

    //남은 시간 계산
    public String getRemainingTime(){
        if (endTime == null) return "";
        Duration duration = Duration.between(LocalDateTime.now() , endTime);

        //현재시간이 종료시간보다 늦으면 종료 상태
        if (duration.isNegative()) return "경매 종료";
        return String.format("%d hours %d minutes", duration.toHours(), duration.toMinutes() % 60);
    }

    // 엔티티가 생성될 때 현재 시간을 uploadDate에 설정
    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}
