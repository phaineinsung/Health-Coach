import React, { useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Typography } from '@mui/material';
import "../../assets/scss/layout/intromain.scss"; 

const introTitle = {
    notice: (
        <div className="notice-icon">
            <div className="icon-background">
                <i className="fas fa-university"></i>
            </div>
        </div>
    ),
    title: (
        <div className="main-title">
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                Health Coach
            </Typography>
            <Typography variant="h4" sx={{ color: '#b88ae6', fontWeight: 'bold' }}>
                .
            </Typography>
        </div>
    ),
    desc: "맞춤형 운동과 영양 지침을 제공하여 목표를 달성하도록 도와주는 건강 코치입니다."
};

const introText = [
    {
        title: "Change",
        desc: "혁신적인 솔루션을 통해 변화를 수용하고 주도하도록 개인을 격려하며, 지속적인 개선과 적응의 문화를 조성합니다."
    },
    {
        title: "Motion",
        desc: "창의적인 협업을 통해 역동적이고 진취적인 행동을 고취시키며, 다양한 관점을 연결하여 복잡한 문제를 해결합니다."
    },
    {
        title: "Futures",
        desc: "환경 보호와 사회적 책임을 촉진하여 지속 가능한 미래를 구상하고 구축하며, 미래 세대에 긍정적인 유산을 남깁니다."
    }
];

const IntroDesc = React.forwardRef(({ title, desc }, ref) => {
    return (
        <div className="intro__desc__item move-right" ref={ref}>
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    );
});

function Intro(props) {
    const itemsRef = useRef([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        }, observerOptions);

        const currentItems = itemsRef.current.filter(item => item !== null);
        currentItems.forEach(item => observer.observe(item));

        return () => {
            currentItems.forEach(item => observer.unobserve(item));
        };
    }, []);

    return (
        <section id="introSection" className={props.attr}>
            <div className="intro__inner container">
                <div className="intro__title move-left">
                    {introTitle.notice}
                    <h3>{introTitle.title}</h3>
                    <p>{introTitle.desc}</p>
                </div>
                <div className={`intro__desc ${props.alignClass} ${props.justifyClass}`}>
                    {introText.map((text, index) => (
                        <IntroDesc
                            key={index}
                            title={text.title}
                            desc={text.desc}
                            ref={(el) => (itemsRef.current[index] = el)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Intro;
