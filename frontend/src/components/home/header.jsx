import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/layout/header.scss';

const Header = ({ attr }) => {
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const subtitleElement = subtitleRef.current;
    const titleElement = titleRef.current;

    const handleScroll = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        } else {
          entry.target.classList.remove('animate');
        }
      });
    };

    const options = {
      threshold: 0.9, // 90% 보일 때 트리거
    };

    const observer = new IntersectionObserver(handleScroll, options);

    if (subtitleElement) observer.observe(subtitleElement);
    if (titleElement) observer.observe(titleElement);

    // 페이지 로드 시 애니메이션 트리거
    subtitleElement?.classList.add('animate');
    titleElement?.classList.add('animate');

    return () => {
      if (subtitleElement) observer.unobserve(subtitleElement);
      if (titleElement) observer.unobserve(titleElement);
    };
  }, []);

  useEffect(() => {
    const subtitleElement = subtitleRef.current;
    const titleElement = titleRef.current;

    // 다른 페이지로 갔다가 돌아왔을 때 애니메이션 초기화
    if (subtitleElement) {
      subtitleElement.classList.remove('animate');
      setTimeout(() => subtitleElement.classList.add('animate'), 100);
    }
    if (titleElement) {
      titleElement.classList.remove('animate');
      setTimeout(() => titleElement.classList.add('animate'), 100);
    }
  }, []);

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path); // 페이지 이동
  };

  return (
    <section id="headerSection" className={attr}>
      <div className="header__inner">
        <div className="header__content">
          <p ref={subtitleRef} className="header__subtitle">Health Coach for Everyone</p>
          <h1 ref={titleRef} className="header__title">
            건강 가이드 <br /> Health Coach
          </h1>
          <button onClick={(e) => handleLinkClick(e, '/intro')} className="header__button">소개</button>
        </div>
        <div className="header__stats">
          <div className="stat-item stat-item-1">
            <div className="stat-icon"><i className="fas fa-bolt"></i></div>
            <div className="stat-text">120%</div>
            <div className="stat-desc">Accumulation of vital figures</div>
          </div>
          <div className="stat-item stat-item-2">
            <div className="stat-icon"><i className="fas fa-heart"></i></div>
            <div className="stat-text">1.1K+</div>
            <div className="stat-desc">accumulation</div>
          </div>
          <div className="stat-item stat-item-3">
            <div className="stat-icon"><i className="fas fa-percent"></i></div>
            <div className="stat-text">85%</div>
            <div className="stat-desc">retention</div>
          </div>
          <div className="stat-item stat-item-4">
            <div className="stat-icon"><i className="fas fa-clock"></i></div>
            <div className="stat-text">24/7</div>
            <div className="stat-desc">Start Date as a Health Coach</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
