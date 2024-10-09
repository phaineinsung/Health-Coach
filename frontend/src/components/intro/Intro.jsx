import React from "react";

const Intro = () => {
    return (
        <div className="intro__page container">
            <div className="intro__health">
                <div className="health__img"></div>
            </div>
            <div className="health__info">
            <h3>건강 코치란?</h3>
            <p>
            건강 코치는 개인 맞춤형 운동 및 영양 지침을 제공하여 최적의 건강과 웰빙을 지원하는 전문가입니다. 각자의 목표에 맞춘 프로그램을 통해 체력 향상, 체중 관리, 식습관 개선을 돕습니다.
            </p>
            </div>
            <h3>슬로건</h3>
            <div className="court">
                <div className="court__img"></div>
                <div className="court__info">
                    <h4>맞춤형 건강 관리로 최적의 당신을 만나다.</h4>
                    <p>
                    건강 코치는 개인의 필요와 목표에 맞춘 맞춤형 운동 및 영양 프로그램을 제공합니다. 이를 통해 최상의 건강과 웰빙을 실현할 수 있도록 돕습니다.
                    </p>
                </div>
            </div>
            <div className="serve">
                <div className="serve__info">
                <h4>지속적인 지원과 피드백으로 건강한 삶을 유지하다.</h4>
                    <p>
                    건강 코치는 꾸준한 피드백과 지원을 통해 지속 가능한 건강한 생활 방식을 유지할 수 있도록 도와줍니다. 변화를 격려하며 목표 달성까지 함께합니다.
                    </p>
                </div>
                <div className="serve__img"></div>
            </div>
            <div className="rally">
                <div className="rally__img"></div>
                <div className="rally__info">
                <h4>목표 달성을 위한 개인화된 솔루션 제공</h4>
                    <p>
                    각자의 목표에 맞춘 개인화된 솔루션을 제공하여 체력 향상, 체중 관리, 식습관 개선 등을 지원합니다. 건강 코치는 최적의 결과를 위해 최선을 다합니다.
                    </p>
                </div>
            </div>
            
        </div>
    );
};

export default Intro;
