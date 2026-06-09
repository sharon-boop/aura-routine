import { useState, useEffect, useCallback, useRef } from 'react'

let toastFn = null

export function useToast() {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef(null)

  const showToast = useCallback((text) => {
    setMsg(text)
    setShow(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setShow(false), 2400)
  }, [])

  useEffect(() => {
    toastFn = showToast
    return () => { toastFn = null }
  }, [showToast])

  return { msg, show, showToast }
}

export function toast(text) {
  if (toastFn) toastFn(text)
}

export function Toast({ msg, show }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>{msg}</div>
  )
}
