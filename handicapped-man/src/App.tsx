import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Target, Award, FileText, Sparkles, CheckCircle, AlertCircle, HelpCircle, Lightbulb, User, Lock, Mail, Volume2, VolumeX, RefreshCw } from 'lucide-react'
import { analyzeFullPresentation, checkInappropriateContent, type FullAnalysisResult, type SentenceAnalysisResult } from '@/lib/utils'
import './App.css'

function App() {
  const [script, setScript] = useState('')
  const [analysisResult, setAnalysisResult] = useState<FullAnalysisResult | null>(null)
  const [improvedScript, setImprovedScript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // 로그인/회원가입 관련 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupMode, setIsSignupMode] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // localStorage에서 로그인 상태 확인
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  
  // 비밀번호 찾기 관련 상태
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [sentCode, setSentCode] = useState('') // 시뮬레이션용
  
  // 마이페이지 관련 상태
  const [isMyPageOpen, setIsMyPageOpen] = useState(false)
  const [scriptHistory, setScriptHistory] = useState<Array<{
    id: number
    script: string
    timestamp: string
    analysisResult?: FullAnalysisResult
  }>>(() => {
    // localStorage에서 히스토리 불러오기
    const saved = localStorage.getItem('scriptHistory')
    return saved ? JSON.parse(saved) : []
  })
  
  // 히스토리 ID 생성용
  const [historyIdCounter, setHistoryIdCounter] = useState(() => {
    // localStorage에서 마지막 ID 불러오기
    const saved = localStorage.getItem('historyIdCounter')
    return saved ? parseInt(saved) : 1
  })

  // textarea 클릭 시 로그인 체크
  const handleTextareaFocus = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
    }
  }

  const handleAnalyze = () => {
    // 비속어/욕설/혐오 발언 검사
    const inappropriateWords = checkInappropriateContent(script)
    
    if (inappropriateWords.length > 0) {
      // 부적절한 내용이 발견되면 경고 메시지 표시
      alert(`⚠️ 부적절한 표현이 감지되었습니다.\n\n발표 대본에는 비속어, 욕설, 혐오 및 비하 발언을 사용할 수 없습니다.\n\n적절한 표현으로 수정해주세요.`)
      return
    }
    
    // 통합 분석 함수 실행
    const result = analyzeFullPresentation(script)
    
    // 분석 결과를 state에 저장하여 UI에 표시
    setAnalysisResult(result)
    
    // 히스토리에 저장
    const newHistory = {
      id: historyIdCounter,
      script: script,
      timestamp: new Date().toLocaleString('ko-KR'),
      analysisResult: result
    }
    setScriptHistory(prev => [newHistory, ...prev]) // 최신순으로 추가
    setHistoryIdCounter(prev => prev + 1)
    
    // 콘솔에도 출력 (디버깅용)
    console.log('✨ 분석 완료:', result)
  }

  // scriptHistory가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('scriptHistory', JSON.stringify(scriptHistory))
  }, [scriptHistory])

  // historyIdCounter가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('historyIdCounter', historyIdCounter.toString())
  }, [historyIdCounter])

  // 개선된 대본 생성 함수
  const handleGenerateImprovedScript = () => {
    if (!analysisResult) return
    
    // 개선된 문장들을 조합하여 새로운 대본 생성
    const improvedSentences = analysisResult.sentenceAnalysis
      .map((item: SentenceAnalysisResult) => item.improved)
      .join('. ')
    
    // 마지막에 마침표 추가
    const finalScript = improvedSentences + '.'
    
    setImprovedScript(finalScript)
    alert('✨ 개선된 대본이 생성되었습니다!')
  }

  // TTS (Text-to-Speech) 함수
  const handleSpeak = (text: string) => {
    // Web Speech API 지원 확인
    if (!('speechSynthesis' in window)) {
      alert('❌ 이 브라우저는 음성 합성을 지원하지 않습니다.')
      return
    }

    // 이미 재생 중이면 중지
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // 음성 합성 객체 생성
    const utterance = new SpeechSynthesisUtterance(text)
    
    // 한국어로 설정
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0 // 속도
    utterance.pitch = 1.0 // 음높이
    utterance.volume = 1.0 // 음량

    // 이벤트 핸들러
    utterance.onstart = () => {
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
      alert('❌ 음성 재생 중 오류가 발생했습니다.')
    }

    // 음성 재생
    window.speechSynthesis.speak(utterance)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    // 간단한 로그인 검증 (실제로는 백엔드 API 호출)
    if (password !== 'test1234') {
      setLoginError('비밀번호가 올바르지 않습니다')
      return
    }
    
    // 로그인 성공
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoginModalOpen(false)
    console.log('로그인 성공:', username)
    alert('로그인 성공!')
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    // 유효성 검사
    if (!username || !password || !email) {
      setLoginError('모든 필드를 입력해주세요')
      return
    }
    
    if (password.length < 6) {
      setLoginError('비밀번호는 6자 이상이어야 합니다')
      return
    }
    
    // 회원가입 성공 (실제로는 백엔드 API 호출)
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoginModalOpen(false)
    console.log('회원가입 성공:', { username, email })
    alert('회원가입 성공! 자동으로 로그인됩니다.')
  }

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode)
    setLoginError('')
    setUsername('')
    setPassword('')
    setEmail('')
  }

  // 비밀번호 찾기 모드 전환
  const handleForgotPassword = () => {
    setIsForgotPasswordMode(true)
    setIsSignupMode(false)
    setLoginError('')
    setVerificationEmail('')
    setVerificationCode('')
    setIsVerificationSent(false)
  }

  // 인증 코드 전송
  const handleSendVerificationCode = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificationEmail) {
      setLoginError('이메일을 입력하세요')
      return
    }
    
    // 6자리 랜덤 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setSentCode(code)
    setIsVerificationSent(true)
    setLoginError('')
    
    // 실제로는 백엔드로 이메일 전송 요청
    alert(`인증 코드가 ${verificationEmail}로 전송되었습니다.\n[테스트용 코드: ${code}]`)
  }

  // 인증 코드 확인 및 로그인
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (verificationCode !== sentCode) {
      setLoginError('인증 코드가 올바르지 않습니다')
      return
    }
    
    // 인증 성공 - 로그인 처리
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoginModalOpen(false)
    setIsForgotPasswordMode(false)
    setIsVerificationSent(false)
    setVerificationEmail('')
    setVerificationCode('')
    alert('인증이 완료되었습니다. 로그인되었습니다!')
  }

  // 비밀번호 찾기 모드에서 돌아가기
  const handleBackToLogin = () => {
    setIsForgotPasswordMode(false)
    setIsVerificationSent(false)
    setVerificationEmail('')
    setVerificationCode('')
    setLoginError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 헤더 */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mic className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              발표 코치
            </h1>
          </div>
          <nav className="flex gap-4">
            {!isLoggedIn ? (
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => setIsLoginModalOpen(true)}
              >
                로그인
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 gap-2"
                  onClick={() => setIsMyPageOpen(true)}
                >
                  <User className="size-5" />
                  프로필
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => {
                    setIsLoggedIn(false)
                    localStorage.removeItem('isLoggedIn')
                    alert('로그아웃되었습니다.')
                  }}
                >
                  로그아웃
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
            <Award className="size-4" />
            AI 기반 발표 연습 플랫폼
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
            자신감 있는 발표를 위한
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              완벽한 연습
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            실시간 피드백과 AI 분석으로 발표 실력을 향상시키세요.
            음성 인식, 시선 추적, 제스처 분석까지 한 번에!
          </p>
        </div>
      </section>

      {/* 로그인/회원가입 모달 */}
      {!isLoggedIn && isLoginModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div 
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors"
            >
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="size-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isForgotPasswordMode ? '비밀번호 찾기' : isSignupMode ? '회원가입' : '로그인'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {isForgotPasswordMode ? '이메일로 인증 코드를 받으세요' : isSignupMode ? '새 계정을 만들어보세요' : '계정에 로그인하여 시작하세요'}
                </p>
              </div>

              {/* 비밀번호 찾기 모드 */}
              {isForgotPasswordMode ? (
                <form onSubmit={isVerificationSent ? handleVerifyCode : handleSendVerificationCode} className="space-y-4">
                  {/* 이메일 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      이메일
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <input
                        type="email"
                        value={verificationEmail}
                        onChange={(e) => setVerificationEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={isVerificationSent}
                      />
                    </div>
                  </div>

                  {/* 인증 코드 입력 (인증 코드 전송 후에만 표시) */}
                  {isVerificationSent && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        인증 코드
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => {
                            setVerificationCode(e.target.value)
                            setLoginError('')
                          }}
                          placeholder="6자리 인증 코드를 입력하세요"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          maxLength={6}
                        />
                      </div>
                    </div>
                  )}

                  {/* 에러 메시지 */}
                  {loginError && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="size-4" />
                      {loginError}
                    </p>
                  )}

                  {/* 버튼 */}
                  <Button 
                    type="submit"
                    className="w-full"
                    size="lg"
                  >
                    {isVerificationSent ? '인증 확인' : '인증 코드 전송'}
                  </Button>

                  {/* 돌아가기 링크 */}
                  <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      ← 로그인으로 돌아가기
                    </button>
                  </div>
                </form>
              ) : (
                /* 일반 로그인/회원가입 모드 */
                <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-4">
              {/* 아이디 입력 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  아이디
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* 이메일 입력 (회원가입 모드에만 표시) */}
              {isSignupMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {/* 비밀번호 입력 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setLoginError('') // 입력 시 에러 메시지 제거
                    }}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* 에러 메시지 */}
                {loginError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="size-4" />
                    {loginError}
                  </p>
                )}
                
                {/* 비밀번호 찾기 (로그인 모드에만 표시) */}
                {!isSignupMode && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      비밀번호를 잊으셨습니까?
                    </button>
                  </div>
                )}
              </div>

              {/* 로그인/회원가입 버튼 */}
              <Button 
                type="submit"
                className="w-full"
                size="lg"
              >
                {isSignupMode ? '회원가입' : '로그인'}
              </Button>

              {/* 로그인/회원가입 전환 링크 */}
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isSignupMode ? '이미 계정이 있으신가요?' : '계정이 없으십니까?'}{' '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    {isSignupMode ? '로그인' : '회원가입'}
                  </button>
                </p>
              </div>
            </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 마이페이지 모달 */}
      {isMyPageOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsMyPageOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsMyPageOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors z-10"
            >
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      마이페이지
                    </h3>
                    <p className="text-blue-100">
                      {username || '사용자'}님의 발표 대본 히스토리
                    </p>
                  </div>
                </div>
              </div>

              {/* 히스토리 목록 */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                {scriptHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="size-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                      아직 작성한 발표 대본이 없습니다.
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                      발표 대본을 입력하고 분석해보세요!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scriptHistory.map((item) => (
                      <div key={item.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-bold text-blue-600 dark:text-blue-400">
                              {item.id}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {item.timestamp}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setScript(item.script)
                              setAnalysisResult(item.analysisResult || null)
                              setIsMyPageOpen(false)
                              alert('✨ 대본이 불러와졌습니다!')
                            }}
                            className="gap-1"
                          >
                            <FileText className="size-4" />
                            불러오기
                          </Button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                          <p className="text-slate-700 dark:text-slate-300 line-clamp-3">
                            {item.script}
                          </p>
                        </div>
                        {item.analysisResult && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                              <CheckCircle className="size-3" />
                              {item.analysisResult.sentences.length}개 문장
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                              <Sparkles className="size-3" />
                              분석 완료
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 대본 입력 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                발표 대본 입력
              </h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              발표할 내용을 입력하시면 AI가 분석하여 피드백을 제공합니다.
            </p>
            
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              onFocus={handleTextareaFocus}
              placeholder="예: 안녕하세요, 오늘은 AI 기술의 발전에 대해 말씀드리겠습니다..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <span className="mr-3">
                  {script.replace(/\s/g, '').length} 글자 (공백 제외)
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  / {script.length} 글자 (공백 포함)
                </span>
              </div>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 bg-white dark:bg-slate-800 text-white dark:text-white border-white"
                disabled={script.length === 0}
                onClick={handleAnalyze}
              >
                <Sparkles className="size-5" />
                분석하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 분석 결과 섹션 */}
      {analysisResult && (
        <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* 제목 */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                분석 결과
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                총 {analysisResult.sentences.length}개의 문장이 분석되었습니다
              </p>
            </div>

            {/* 1. 문장 개선 결과 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Lightbulb className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  문장 개선 결과
                </h4>
              </div>
              
              <div className="space-y-4">
                {analysisResult.sentenceAnalysis.map((analysis: SentenceAnalysisResult, index: number) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {index + 1}
                      </span>
                      <p className="flex-1 text-slate-900 dark:text-white font-medium">
                        {analysis.original}
                      </p>
                    </div>
                    
                    {/* 문제점 표시 */}
                    {analysis.issues.length > 0 ? (
                      <div className="flex gap-2 mb-2 ml-8">
                        <AlertCircle className="size-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          {analysis.issues.join(', ')}
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2 mb-2 ml-8">
                        <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-600 dark:text-green-400">
                          문제없음
                        </p>
                      </div>
                    )}
                    
                    {/* 개선된 문장 */}
                    {analysis.original !== analysis.improved && (
                      <div className="ml-8 mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                          💡 개선된 문장
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {analysis.improved}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 개선된 대본 생성 섹션 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <RefreshCw className="size-5 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                    개선된 대본
                  </h4>
                </div>
                <Button 
                  onClick={handleGenerateImprovedScript}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <Sparkles className="size-5" />
                  대본 생성
                </Button>
              </div>

              {improvedScript ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                      {improvedScript}
                    </p>
                  </div>
                  
                  {/* TTS 버튼 */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleSpeak(improvedScript)}
                      variant={isSpeaking ? "destructive" : "default"}
                      className="gap-2 text-white"
                      size="lg"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="size-5" />
                          음성 중지
                        </>
                      ) : (
                        <>
                          <Volume2 className="size-5" />
                          음성으로 듣기
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(improvedScript)
                        alert('📋 개선된 대본이 클립보드에 복사되었습니다!')
                      }}
                      variant="outline"
                      className="gap-2 text-white border-white hover:bg-white/10"
                      size="lg"
                    >
                      <FileText className="size-5" />
                      복사하기
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>위의 "대본 생성" 버튼을 눌러 개선된 대본을 만들어보세요!</p>
                </div>
              )}
            </div>

            {/* 3. 예상 질문 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <HelpCircle className="size-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  예상 질문
                </h4>
              </div>
              
              <div className="space-y-3">
                {analysisResult.expectedQuestions.map((question: string, index: number) => (
                  <div key={index} className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-200 dark:bg-orange-900/50 text-sm font-bold text-orange-700 dark:text-orange-300 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 전체 발표 피드백 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Target className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  전체 발표 피드백
                </h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-2xl">📌</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">도입</p>
                    <p className="text-slate-600 dark:text-slate-300">{analysisResult.presentationFeedback.introduction}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">흐름</p>
                    <p className="text-slate-600 dark:text-slate-300">{analysisResult.presentationFeedback.flow}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">마무리</p>
                    <p className="text-slate-600 dark:text-slate-300">{analysisResult.presentationFeedback.conclusion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 푸터 */}
      <footer className="border-t bg-white dark:bg-slate-900 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2026 발표 코치. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
