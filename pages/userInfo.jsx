import ShowUserInfo from '@/components/UserInfo/ShowUserInfo'
import React from 'react'
import { URL } from '@/utils/consts'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
import ShowAdminInfo from '@/components/AdminInfo/ShowAdminInfo'

export default function UserInfo() {
  const { data: user, isLoading: isProjectLoading } = useSWR(
    `${URL}/getCurrentUser`,
    fetcher,
  )

  return (
   !isProjectLoading && <>
   {user.rol !== '*' && <ShowUserInfo user={user} isProjectLoading={isProjectLoading}/>}
   {user.rol === '*' && <ShowAdminInfo user={user} isProjectLoading={isProjectLoading}/>}
   </>
  )
}
