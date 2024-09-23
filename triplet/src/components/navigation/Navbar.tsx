import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

// 이미지 import
import { ReactComponent as HomeImg} from '../../assets/navigation/home.svg';
import { ReactComponent as PayImg} from '../../assets/navigation/pay.svg';
import { ReactComponent as TravelImg} from '../../assets/navigation/travel.svg';
import { ReactComponent as FeedImg} from '../../assets/navigation/feed.svg';
import { ReactComponent as MyPageImg} from '../../assets/navigation/mypage.svg';

// 색깔 변경된 이미지 import
import { ReactComponent as HomeImgActive} from '../../assets/navigation/homeActive.svg';
import { ReactComponent as PayImgActive} from '../../assets/navigation/payActive.svg';
import { ReactComponent as TravelImgActive} from '../../assets/navigation/travelActive.svg';
import { ReactComponent as FeedImgActive} from '../../assets/navigation/feedActive.svg';
import { ReactComponent as MyPageImgActive} from '../../assets/navigation/mypageActive.svg';

// CSS styled
const NavbarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 56px;
  background-color: white;
  padding-top: 8px;
  text-align: center;
  z-index: 1000;
`;

const StyledP = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#008DE7' : '#888888')}; /* 활성화 상태에 따라 색상 변경 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  font-size: 10px;
`;

const StyledUl = styled.ul`
  list-style-type: none; /* li 태그의 점 제거 */
  padding: 0 30px; /* 양쪽 패딩 설정 */
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledLi = styled.li`
  margin-bottom: 10px; /* 각 리스트 항목 간의 간격 설정 */
  display: flex;
  align-items: center;
`;

const Navbar = () => {
  const location = useLocation();
  const currentPage = useSelector((state: any) => state.navi.currentPage);

  return (
    <NavbarContainer>
      <StyledUl>
        <StyledLi>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            {currentPage === 'home' ? <HomeImgActive /> : <HomeImg />}
            <StyledP isActive={currentPage === 'home'}>홈</StyledP>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link to="/pay" style={{ textDecoration: 'none' }}>
            {currentPage === 'pay' ? <PayImgActive /> : <PayImg />}
            <StyledP isActive={currentPage === 'pay'}>페이</StyledP>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link to="/travels" style={{ textDecoration: 'none' }}>
            {currentPage === 'travels' ? <TravelImgActive /> : <TravelImg />}
            <StyledP isActive={currentPage === 'travels'}>여행</StyledP>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link to="/feed" style={{ textDecoration: 'none' }}>
            {currentPage === 'feed' ? <FeedImgActive /> : <FeedImg />}
            <StyledP isActive={currentPage === 'feed'}>피드</StyledP>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link to="/mypage" style={{ textDecoration: 'none' }}>
            {currentPage === 'mypage' ? <MyPageImgActive /> : <MyPageImg />}
            <StyledP isActive={currentPage === 'mypage'}>마이</StyledP>
          </Link>
        </StyledLi>
      </StyledUl>
    </NavbarContainer>
  );
};

export default Navbar;
