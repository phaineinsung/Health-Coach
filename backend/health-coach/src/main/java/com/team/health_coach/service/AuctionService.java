package com.team.health_coach.service;

import com.team.health_coach.dto.AuctionItem_DTO;
import com.team.health_coach.dto.User_DTO;
import com.team.health_coach.entity.AuctionItem;
import com.team.health_coach.entity.User;
import com.team.health_coach.repository.AuctionItemRepository;
import com.team.health_coach.repository.User_Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuctionService {
    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private User_Repo userRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    //특정 경매 물품 조회
    public AuctionItem_DTO getAuctionItemById(Long auctionItemId) {
        Optional<AuctionItem> auctionItemOpt = auctionItemRepository.findById(auctionItemId);
        if (auctionItemOpt.isPresent()) {
            AuctionItem auctionItem = auctionItemOpt.get();
            AuctionItem_DTO dto = convertToDTO(auctionItem);

            // Redis에서 임시 입찰 정보를 가져옴
            String auctionKey = "auction:" + auctionItemId;
            Double tempHighestBid = (Double) redisTemplate.opsForHash().get(auctionKey, "temp_highestBid");
            String tempHighestBidderStr = (String) redisTemplate.opsForHash().get(auctionKey, "temp_highestBidder"); //Redis에서는 String 타입을 유지

            Long tempHighestBidder = null; // DTO 및 Entity에는 Long 타입으로 선언해서 이를 변환할 필요가 있다.
            if (tempHighestBidderStr != null) {
                try {
                    tempHighestBidder = Long.parseLong(tempHighestBidderStr); // String 타입으로 받아온 정보를 Long타입으로 변환
                } catch (NumberFormatException e) {
                    // 로그 또는 예외 처리
                    System.err.println("Failed to parse tempHighestBidder: " + tempHighestBidderStr);
                }
            }

            // DTO에 추가
            dto.setTempHighestBid(tempHighestBid);
            dto.setTempHighestBidder(tempHighestBidder);

            return dto;
        } else {
            return null;
        }
    }

    // 경매 물품 전체 조회
    public List<AuctionItem_DTO> getAllAuctionItems() {
        List<AuctionItem> auctionItems = auctionItemRepository.findAll();

        if (!auctionItems.isEmpty()) {
            return auctionItems.stream()
                    .map(this::convertToDTOWithRedisData)
                    .collect(Collectors.toList());
        } else {
            return new ArrayList<>();
        }
    }

    //Redis의 데이터를 DTO로 전달해주는 함수
    private AuctionItem_DTO convertToDTOWithRedisData(AuctionItem auctionItem) {
        AuctionItem_DTO dto = convertToDTO(auctionItem);

        String auctionKey = "auction:" + auctionItem.getAuctionId();
        Double tempHighestBid = (Double) redisTemplate.opsForHash().get(auctionKey, "temp_highestBid");
        String tempHighestBidderStr = (String) redisTemplate.opsForHash().get(auctionKey, "temp_highestBidder");

        Long tempHighestBidder = null; // DTO 및 Entity에는 Long 타입으로 선언해서 이를 변환할 필요가 있다.
        if (tempHighestBidderStr != null) {
            try {
                tempHighestBidder = Long.parseLong(tempHighestBidderStr);  // String 타입으로 받아온 정보를 Long타입으로 변환
            } catch (NumberFormatException e) {
                // 로그 또는 예외 처리
                System.err.println("Failed to parse tempHighestBidder: " + tempHighestBidderStr);
            }
        }

        // DTO에 추가
        dto.setTempHighestBid(tempHighestBid);
        dto.setTempHighestBidder(tempHighestBidder);

        return dto;
    }
    
    // 경매 물품 등록 서비스
    public AuctionItem_DTO createAuctionItem(AuctionItem_DTO auctionItem_dto) {
        User user = userRepository.findById(auctionItem_dto.getUserNum())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + auctionItem_dto.getUserNum()));

        //DTO로 데이터 전달
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setUser(user);
        auctionItem.setItemName(auctionItem_dto.getItemName());
        auctionItem.setStartPrice(auctionItem_dto.getStartPrice());
        auctionItem.setEndTime(auctionItem_dto.getEndTime());
        auctionItem.setImage(auctionItem_dto.getImage());
        auctionItem.setContent(auctionItem_dto.getContent());

        auctionItemRepository.save(auctionItem);

        // 처음 물건이 등록되면 temp_highestBid는 StartPrice로 temp_highestbidder는 null로 초기값 구성
        String auctionKey = "auction:" + auctionItem.getAuctionId();
        redisTemplate.opsForHash().put(auctionKey, "temp_highestBid", auctionItem.getStartPrice()); // 초기값을 startprice로 함으로써 초기 가격보다 낮은 금액 입찰 방지를 위함
        redisTemplate.opsForHash().put(auctionKey, "temp_highestBidder", ""); // 입찰자 없음을 null로 표현

        //AuctionItem_DTO.java의 생성자 순서에 맞게 변수들을 넣어주어 DTO의 생성자를 호출한다.
        return new AuctionItem_DTO(
                auctionItem.getAuctionId(), // Long auctionId
                auctionItem.getItemName(),  // String itemName
                auctionItem.getUser().getUserNum(), // Long userNum
                auctionItem.getStartPrice(), // double startPrice
                auctionItem.getEndTime(), // LocalDateTime endTime
                auctionItem.getContent(), // String content
                auctionItem.getUploadDate(), // LocalDateTime uploadDate
                auctionItem.getImage(), // String image
                auctionItem.getHighestBid(), // Double highestBid
                auctionItem.getHighestBidder() != null ? auctionItem.getHighestBidder().getUserNum() : null, // Long highestBidder
                auctionItem.getStartPrice(),  // 초기 Redis의 값은 startPrice로 시작한다. // Double tempHighestBid
                null, // temp_highestBidder는 null로 시작 // Long tempHighestBidder
                auctionItem.getRemainingTime() // String remainingTime
        );
    }

    // 입찰 처리
    public String placeBid(Long auctionItemId, double bidAmount, Long highestBidderNum) {
        String auctionKey = "auction:" + auctionItemId;

        Double highestBid = (Double) redisTemplate.opsForHash().get(auctionKey, "temp_highestBid");

        // User 객체인 highestBidder에 대한 처리
        User highestBidder = userRepository.findById(highestBidderNum)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + highestBidderNum));

        // 기존 최고 입찰 금액보다 작은 경우
        if (highestBid != null && bidAmount <= highestBid) {
            return String.format("입찰 실패: 현재 최고가는 %.2f입니다.", highestBid);
        }

        //입찰시 DB로 저장되지 않고 Redis로 저장된다.
        redisTemplate.opsForHash().put(auctionKey, "temp_highestBid", bidAmount);
        redisTemplate.opsForHash().put(auctionKey, "temp_highestBidder", highestBidderNum.toString()); // Long을 String으로 변환하여 저장

        return String.format("입찰 성공: 현재 최고가는 %.2f입니다.", bidAmount);
    }

    // 입찰 종료
    public void endAuction(Long auctionItemId) {
        Optional<AuctionItem> auctionItemOpt = auctionItemRepository.findById(auctionItemId);
        if (auctionItemOpt.isPresent()) {
            AuctionItem auctionItem = auctionItemOpt.get();
            String auctionKey = "auction:" + auctionItemId;
            Double highestBid = (Double) redisTemplate.opsForHash().get(auctionKey, "temp_highestBid");
            String highestBidderStr = (String) redisTemplate.opsForHash().get(auctionKey, "temp_highestBidder");

            Long highestBidderId = null; // DTO 및 Entity에는 Long 타입으로 선언해서 이를 변환할 필요가 있다.
            if (highestBidderStr != null) {
                try {
                    highestBidderId = Long.parseLong(highestBidderStr); // String 타입으로 받아온 정보를 Long타입으로 변환
                } catch (NumberFormatException e) {
                    // 로그 또는 예외 처리
                    System.err.println("Failed to parse highestBidderId: " + highestBidderStr);
                }
            }

            // highestBid 와 highestBidderId가 모두 null이 아닌 경우에만 DB에 입력된다.
            if (highestBid != null && highestBidderId != null) {
                //람다 표현식 참조를 위해 final 선언
                final Long finalHighestBidderId = highestBidderId;
                
                // finalHighestBidderId가 실제 User의 DB에 존재하는지 확인하는 과정 
                User highestBidder = userRepository.findById(finalHighestBidderId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + finalHighestBidderId));

                // DB에 최종 입찰가격, 입찰자 저장
                auctionItem.setHighestBid(highestBid);
                auctionItem.setHighestBidder(highestBidder);
                auctionItemRepository.save(auctionItem);
            }

            // Redis에서의 입찰 정보 삭제
            redisTemplate.delete(auctionKey);
        }
    }

    // DTO로 변환
    private AuctionItem_DTO convertToDTO(AuctionItem auctionItem) {
        AuctionItem_DTO dto = new AuctionItem_DTO();
        dto.setAuctionId(auctionItem.getAuctionId());
        dto.setItemName(auctionItem.getItemName());
        dto.setContent(auctionItem.getContent());
        dto.setImage(auctionItem.getImage());
        dto.setUploadDate(auctionItem.getUploadDate());

        // User 객체에서 userNum을 가져와 설정
        dto.setUserNum(auctionItem.getUser() != null ? auctionItem.getUser().getUserNum() : null);

        dto.setStartPrice(auctionItem.getStartPrice());
        dto.setEndTime(auctionItem.getEndTime());

        // Redis에서 임시 입찰 정보를 가져옵니다.
        String auctionKey = "auction:" + auctionItem.getAuctionId();
        Double tempHighestBid = (Double) redisTemplate.opsForHash().get(auctionKey, "temp_highestBid");
        String tempHighestBidderStr = (String) redisTemplate.opsForHash().get(auctionKey, "temp_highestBidder");

        Long tempHighestBidder = null;
        if (tempHighestBidderStr != null) {
            try {
                tempHighestBidder = Long.parseLong(tempHighestBidderStr);
            } catch (NumberFormatException e) {
                // 로그 또는 예외 처리
                System.err.println("Failed to parse tempHighestBidder: " + tempHighestBidderStr);
            }
        }

        // Redis의 임시 정보를 temp 필드에 저장
        dto.setTempHighestBid(tempHighestBid != null ? tempHighestBid : null);
        dto.setTempHighestBidder(tempHighestBidder != null ? tempHighestBidder : null);

        // DB의 최종 입찰 정보를 highestBid, highestBidder 필드에 저장
        dto.setHighestBid(auctionItem.getHighestBid() != null ? auctionItem.getHighestBid() : null);
        dto.setHighestBidder(auctionItem.getHighestBidder() != null ? auctionItem.getHighestBidder().getUserNum() : null);

        // 남은 시간 설정
        dto.setRemainingTime(auctionItem.getRemainingTime());

        return dto;
    }
}