import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLatestPosts } from '../../api/UserApi'; // getLatestPosts를 import

function PortDesc({ portImg, title, desc, postId }) {
    return (
        <div className="port">
            <Link to={`/community/${postId}`}>
                <figure className="port__header">
                    {portImg && <img src={portImg} alt={title} />}
                </figure>
                <div className="port__body">
                    <div className="title">
                        <h4>{title}</h4>
                        <p>{desc}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

function Port(props) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // getLatestPosts 함수를 호출하여 API 데이터를 가져옵니다.
        getLatestPosts()
            .then(data => {
                console.log('Response data:', data);
                setPosts(data); // 이미 6개로 제한되어 있음
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch latest posts:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section id="portSection" className={props.attr}>
            <h3>최신 게시물</h3>
            <div className="port__inner container">
                <div className="port__btn">
                    <Link to="/community" className="styled-link">커뮤니티</Link>
                    <Link to="/community/new" className="styled-link">글 작성</Link>
                    <Link to="/favorites" className="styled-link">즐겨찾기 목록</Link>
                </div>
                <div className="port__cont">
                    {posts.map((post, index) => (
                        <PortDesc
                            key={index}
                            title={post.title} // title과 desc를 바꿈
                            desc={post.content} // title과 desc를 바꿈
                            postId={post.postId} // 게시물의 ID를 전달
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Port;
