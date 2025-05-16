'use client'
import { Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import React from 'react'

function SignOutButton() {
    return (
        <Button
            variant="contained"
            color='error'
            onClick={() => signOut({ redirect: true })}
        >
            Sign Out
        </Button>
    )
}

export default SignOutButton