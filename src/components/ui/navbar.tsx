import React from 'react'
import { Button } from './button'
import { Separator } from './separator'

interface NavbarProps {
    onLogout: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    return (
        <div className="h-[56px]">
            <div className='my-2 flex justify-end'>
                <Button className='mr-4' variant="secondary" type='submit' onClick={onLogout}>Log out</Button>
            </div>
            <Separator />
        </div>
    )
}
