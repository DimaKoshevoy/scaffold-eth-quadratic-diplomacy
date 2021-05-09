import React, { useEffect } from 'react'
import $ from 'jquery'
import { connectController } from './controller'
import { useContractLoader, useContractReader } from '../../../../../../../hooks'
import { getLocalProvider, getTargetNetwork, Transactor } from '../../../../../../../helpers'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

const styles = {
  button: {
    float: 'left',
    width: '96%',
    marginTop: '30px',
    marginLeft: '2%',
    marginRight: '5%',
    fontSize: '8px'
  }
}

const TerminalContent = (props) => {
  console.log('in city TerminalContent:')
  console.log({ props })
  const { dialogs: { currentDialog = [], currentDialogIndex }, actions } = props
  const scrollToBottom = _elementSelector => {
    let elementSelector = `#terminalDialogContainer .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  /*
  const userBalance = useContractReader(readContracts, 'contractNameTODO', 'balances', [
    userAddress
  ])
  console.log('🤗 userBalance:', userBalance && userBalance.toString())
  */

  // TODO:
  const userCompletedLevel = false

  return (
    <>
      {currentDialog.map((dialogStep, index) => {
        const { anchorId, avatar, alignment, text, choices } = dialogStep

        const isLastVisibleDialog = index === currentDialogIndex
        const isFinalDialog = index === currentDialog.length - 1

        if (index <= currentDialogIndex) {
          return (
            <div
              style={{
                float: alignment,
                width: '100%',
                margin: '15px 0'
              }}
            >
              {alignment === 'left' && (
                <img
                  src={`./assets/${avatar}`}
                  alt='avatar'
                  className='background-image'
                  style={{
                    minWidth: '40px',
                    transform: 'scaleX(1)'
                  }}
                />
              )}
              <div
                className={`nes-balloon from-${alignment}`}
                style={{
                  width: 'calc(100% - 60px)',
                  padding: '6px',
                  fontSize: '8px',
                  lineHeight: '15px'
                }}
              >
                <p>{text}</p>
              </div>
              {alignment === 'right' && (
                <img
                  src={`./assets/${avatar}`}
                  alt='avatar'
                  className='background-image'
                  style={{
                    minWidth: '40px',
                    transform: 'scaleX(-1)'
                  }}
                />
              )}

              {isLastVisibleDialog &&
                choices &&
                choices.length &&
                choices.map(choice => {
                  return (
                    <button
                      type='button'
                      className='nes-btn is-warning'
                      id={choice.id}
                      onClick={() => {
                        if (choice.goToDialog) {
                          console.log('now going to dialog: ' + choice.goToDialog)
                          actions.setCurrentDialog({ name: choice.goToDialog })
                        } else {
                          actions.continueDialog()
                        }
                        scrollToBottom()
                      }}
                      style={{ ...styles.button }}
                    >
                      {choice.buttonText}
                    </button>
                  )
                })}

              {!isFinalDialog && isLastVisibleDialog && !choices && (
                <button
                  type='button'
                  className='nes-btn'
                  id='continue'
                  onClick={() => {
                    actions.continueDialog()
                    scrollToBottom()
                  }}
                  style={{ ...styles.button }}
                >
                  Continue
                </button>
              )}
            </div>
          )
        }
      })}

      {userCompletedLevel && (
        <button
          type='button'
          className='nes-btn'
          id='continue'
          onClick={() => {
            // actions.startNextLevel()
            scrollToBottom()
          }}
          style={{ ...styles.button }}
        >
          Go to next level
        </button>
      )}
    </>
  )
}

export default connectController(TerminalContent)
