import { useState, useEffect} from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useLocation } from 'react-router-dom'
export default function OCAttendanceDashbord(props) {
    const location = useLocation()
    const path = window.location.href
    return(
        <QRCodeSVG value={path}></QRCodeSVG>
    )

}