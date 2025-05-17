'use client'
import { Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import React from 'react'

function SignOutButton() {
    return (
        <Button
            variant="contained"
            color='error'
            onClick={() => signOut({ redirect: false, callbackUrl: '/' })}
        >
            Sign Out
        </Button>
    )
}

export default SignOutButton