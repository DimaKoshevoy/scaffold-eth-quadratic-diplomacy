import React, { useState } from 'react'
import { Button } from 'antd'
import shortid from 'shortid'

import { Background, Terminal } from '../gameItems/components'
import WindowModal from '../gameItems/components/WindowModal'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Intro, City, CityOutskirts, Workstation } from '../backgrounds'

import Dialog from './Dialog'

const NewLevel = ({ dialog, actions }) => {
  // ----------------------------------------
  const [background, setBackground] = useState('intro')

  const backgroundStrings = ['intro', 'city', 'cityOutskirts', 'workstation']

  let backgroundComp
  if (background === 'intro') {
    backgroundComp = <Intro />
  } else if (background === 'city') {
    backgroundComp = <City />
  } else if (background === 'cityOutskirts') {
    backgroundComp = <CityOutskirts />
  } else if (background === 'workstation') {
    backgroundComp = <Workstation />
  }

  const getRandomBackground = () => {
    return backgroundStrings[Math.floor(Math.random() * backgroundStrings.length)]
  }
  // ----------------------------------------

  return (
    <div id='newLevel'>
      <Background>{backgroundComp}</Background>

      <Terminal>
        <Dialog dialog={dialog} actions={actions} />
      </Terminal>

      <WindowModal
        uniqueWindowId={shortid()}
        initWidth={400}
        initHeight={600}
        initTop={100}
        initLeft={100}
        backgroundPath='./assets/trimmed/window_trimmed.png'
        dragAreaHeightPercent={20}
        onRequestClose={() => console.log('onRequestClose')}
        isOpen
        contentContainerStyle={{ marginTop: '20%', paddingLeft: 20, paddingRight: 20 }}
      >
        <div style={{ color: 'white' }}>
          <p>Lorem Ipsum</p>
          <Button block onClick={() => actions.dialog.continueDialog()}>
            Advance Dialog
          </Button>
          <Button block onClick={() => actions.wallet.showWallet()}>
            Show Wallet
          </Button>
          <Button block onClick={() => actions.wallet.hideWallet()}>
            Hide Wallet
          </Button>
          <Button block onClick={() => actions.wallet.toggleWalletVisibility()}>
            Toggle Wallet
          </Button>
          <Button block onClick={() => actions.terminal.showTerminal()}>
            Show Terminal
          </Button>
          <Button block onClick={() => actions.terminal.hideTerminal()}>
            Hide Terminal
          </Button>
          <Button block onClick={() => actions.terminal.toggleTerminalVisibility()}>
            Toggle Terminal
          </Button>
          <Button block onClick={() => setBackground(getRandomBackground())}>
            Set Background
          </Button>
        </div>
      </WindowModal>
    </div>
  )
}

export default wrapGlobalGameData(NewLevel)
