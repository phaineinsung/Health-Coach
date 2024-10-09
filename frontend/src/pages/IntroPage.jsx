
import React from 'react'
import Contents from '../components/layout/Contents'
import ContTitle from '../components/layout/ContTitle'
import Intro from '../components/intro/Intro'


const IntroPage = () => {
  return (
    <div>
      <Contents>
        <ContTitle title="Health Coach" />
        <Intro />
      </Contents>
    </div>
  )
}

export default IntroPage
