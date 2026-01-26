import React, { useState, useRef, useEffect } from 'react'
import { Button, Field, Fieldset, Input, Label, Legend } from '@headlessui/react'
import { Loader } from 'lucide-react'
import clsx from 'clsx'
import { gsap } from 'gsap'

function AuthModal({initialMode='login'}) {
  const [isLogin, setIsLogin] = useState(initialMode==='login')
  const [loginInfos, setLoginInfos] = useState({
    email: '',
    password: ''
  })
  const [signupInfos, setSignupInfos] = useState({
    firstName: '',
    lastName: '',
    email: '', 
        password: '',
    confirmPassword: ''
  })
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingSignup, setLoadingSignup] = useState(false)
  const [errors, setErrors] = useState('')

  const loginFieldsRef = useRef([])
  const signupFieldsRef = useRef([])
  const legendRef = useRef(null)
  const buttonRef = useRef(null)
  const linkRef = useRef(null)

 useEffect(() => {
  if (isLogin) {
    // Animate to Login - only animate if elements exist
    if (loginFieldsRef.current.filter(Boolean).length > 0) {
      gsap.fromTo(
        loginFieldsRef.current.filter(Boolean),
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      )
    }
    if (signupFieldsRef.current.filter(Boolean).length > 0) {
      gsap.fromTo(
        signupFieldsRef.current.filter(Boolean),
        { x: 0, opacity: 1 },
        { x: 100, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' }
      )
    }
  } else {
    // Animate to Signup - only animate if elements exist
    if (signupFieldsRef.current.filter(Boolean).length > 0) {
      gsap.fromTo(
        signupFieldsRef.current.filter(Boolean),
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      )
    }
    if (loginFieldsRef.current.filter(Boolean).length > 0) {
      gsap.fromTo(
        loginFieldsRef.current.filter(Boolean),
        { x: 0, opacity: 1 },
        { x: -100, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' }
      )
    }
  }

  // Animate legend and button - check if they exist
  const elements = [legendRef.current, buttonRef.current, linkRef.current].filter(Boolean)
  if (elements.length > 0) {
    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.3, stagger: 0.1 }
    )
  }
}, [isLogin])

  const handleLoginSubmit = async () => {
    setLoadingLogin(true)
    // Your login logic here
    console.log('Login with:', loginInfos)
    // await makeLoginRequest(loginInfos)
    setLoadingLogin(false)
  }

  const handleSignupSubmit = async () => {
    setLoadingSignup(true)
    // Your signup logic here
    console.log('Signup with:', signupInfos)
    // await makeSignupRequest(signupInfos)
    setLoadingSignup(false)
  }

  const toggleForm = (e) => {
    e.preventDefault()
    setIsLogin(!isLogin)
    setErrors('')
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50">
      <Fieldset className="space-y-6 rounded-xl bg-black/90 p-6 sm:p-10 relative overflow-hidden">
        <Legend ref={legendRef} className="text-3xl font-semibold text-white">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Legend>

        {/* Login Form */}
        {isLogin && (
          <>
            <Field ref={(el) => (loginFieldsRef.current[0] = el)}>
              <Label className="text-sm/6 font-medium text-white">Email</Label>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-white/25'
                )}
                type="email"
                placeholder="john@domain.com"
                value={loginInfos.email}
                onChange={(e) => setLoginInfos((prev) => ({ ...prev, email: e.target.value }))}
              />
            </Field>

            <Field ref={(el) => (loginFieldsRef.current[1] = el)}>
              <div className="flex justify-between items-center">
                <Label className="text-sm/6 font-medium text-white">Password</Label>
                <a href="#" className="text-sm text-white/70 hover:text-white">
                  Forgot Your Password?
                </a>
              </div>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-white/25'
                )}
                placeholder="Your Password"
                type="password"
                value={loginInfos.password}
                onChange={(e) => setLoginInfos((prev) => ({ ...prev, password: e.target.value }))}
              />
            </Field>
          </>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field ref={(el) => (signupFieldsRef.current[0] = el)}>
                <Label className="text-sm/6 font-medium text-white">First Name</Label>
                <Input
                  className={clsx(
                    'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                    'focus:outline-none focus:ring-2 focus:ring-white/25'
                  )}
                  type="text"
                  placeholder="John"
                  value={signupInfos.firstName}
                  onChange={(e) => setSignupInfos((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </Field>

              <Field ref={(el) => (signupFieldsRef.current[1] = el)}>
                <Label className="text-sm/6 font-medium text-white">Last Name</Label>
                <Input
                  className={clsx(
                    'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                    'focus:outline-none focus:ring-2 focus:ring-white/25'
                  )}
                  type="text"
                  placeholder="Doe"
                  value={signupInfos.lastName}
                  onChange={(e) => setSignupInfos((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </Field>
            </div>

            <Field ref={(el) => (signupFieldsRef.current[2] = el)}>
              <Label className="text-sm/6 font-medium text-white">Email</Label>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-white/25'
                )}
                type="email"
                placeholder="john@domain.com"
                value={signupInfos.email}
                onChange={(e) => setSignupInfos((prev) => ({ ...prev, email: e.target.value }))}
              />
            </Field>

            <Field ref={(el) => (signupFieldsRef.current[3] = el)}>
              <Label className="text-sm/6 font-medium text-white">Password</Label>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-white/25'
                )}
                placeholder="Create a password"
                type="password"
                value={signupInfos.password}
                onChange={(e) => setSignupInfos((prev) => ({ ...prev, password: e.target.value }))}
              />
            </Field>

            <Field ref={(el) => (signupFieldsRef.current[4] = el)}>
              <Label className="text-sm/6 font-medium text-white">Confirm Password</Label>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-white/25'
                )}
                placeholder="Confirm your password"
                type="password"
                value={signupInfos.confirmPassword}
                onChange={(e) => setSignupInfos((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </Field>
          </>
        )}

        <Button
          ref={buttonRef}
          disabled={
            isLogin
              ? !loginInfos.email || !loginInfos.password
              : !signupInfos.firstName ||
                !signupInfos.lastName ||
                !signupInfos.email ||
                !signupInfos.password ||
                !signupInfos.confirmPassword
          }
          onClick={isLogin ? handleLoginSubmit : handleSignupSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-700/80 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLogin ? (
            loadingLogin ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              'Login'
            )
          ) : loadingSignup ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            'Sign Up'
          )}
        </Button>

        <Legend ref={linkRef} className="text-center text-sm font-semibold text-white/80">
          {isLogin ? "Don't Have An Account? " : 'Already Have An Account? '}
          <a href="#" onClick={toggleForm} className="text-sm text-white hover:underline">
            {isLogin ? 'Create One' : 'Login'}
          </a>
        </Legend>
      </Fieldset>
    </div>
  )
}

export default AuthModal