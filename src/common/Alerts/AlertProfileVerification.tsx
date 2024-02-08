import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ExternalLink } from 'oa-components'
import { Alert, Flex, Text } from 'theme-ui'

import { useCommonStores } from '../..'

type VerificationEmailState = 'pending' | 'error' | 'sent'

/**
 * A simple notification banner component that allows users to (re-)send a verification email.
 */
export const AlertProfileVerification = observer(() => {
  const [verificationState, setVerificationState] =
    useState<VerificationEmailState>('pending')
  const { userStore } = useCommonStores().stores
  const authUser = userStore.authUser
  if (!authUser) return null

  if (authUser.emailVerified) return null

  const handleOnClick = async () => {
    try {
      await userStore.sendEmailVerification()
      setVerificationState('sent')
    } catch (error) {
      setVerificationState('error')
    }
  }

  const isVerificationSuccessful = verificationState === 'sent'
  const isVerificationPending = verificationState === 'pending'
  const alertLabel = isVerificationPending
    ? '✉️ Click here to receive an email to confirm your account.'
    : "Sorry, we couldn't send an email. Please try again later."

  return (
    <Flex data-cy="verificationBanner" style={{ zIndex: 3001 }}>
      <Alert
        onClick={handleOnClick}
        variant={isVerificationSuccessful ? 'success' : 'failure'}
        sx={{
          borderRadius: 0,
          alignItems: 'center',
          flex: '1',
          justifyContent: 'center',
        }}
      >
        {isVerificationSuccessful && (
          <Text
            sx={{
              textAlign: 'center',
              fontSize: 2,
              fontWeight: 'normal',
            }}
          >
            Verification email sent. Please check your inbox and spam folder.
            (Let us{' '}
            <ExternalLink
              sx={{ textDecoration: 'underline', color: 'grey' }}
              href="mailto:platform@onearmy.earth"
            >
              know
            </ExternalLink>{' '}
            if you didnt get it)
          </Text>
        )}
        {!isVerificationSuccessful && (
          <Text
            sx={{
              textAlign: 'center',
              fontSize: 2,
              fontWeight: 'normal',
              textDecoration: isVerificationPending ? 'underline' : 'none',
              cursor: isVerificationPending ? 'pointer' : 'default',
            }}
          >
            {alertLabel}
          </Text>
        )}
      </Alert>
    </Flex>
  )
})
