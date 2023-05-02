import React, { useEffect } from 'react'

function UserPage() {
  useEffect(() => {
    // This function will be called after the component is rendered
    console.log('Component was rendered')
  })
  return (
    <div className="flex">
      <div className="mx-auto">Welcome Tin</div>
    </div>
  )
}

export default UserPage
