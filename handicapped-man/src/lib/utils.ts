import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 비속어, 욕설, 혐오 및 비하 발언 목록
 * 실제 프로덕션에서는 더 포괄적인 리스트와 외부 API 사용을 권장합니다
 */
const INAPPROPRIATE_WORDS = [
  // 비속어 및 욕설
  '시발', '씨발', '병신', '좆', '지랄', '개새끼', '새끼', '썅', '쌍놈',
  '미친', '또라이', '지랄', '닥쳐', '꺼져', '죽어', '염병', '엿먹어',
  '개같은', '개소리', '개뻥', '개자식', '쓰레기', '인간말종',
  // 혐오 표현
  '한남', '김치녀', '된장녀', '맘충', '틀딱', '급식충', '노무현', 
  '문재인', '박근혜', '이명박', '윤석열', // 정치인 비하는 맥락에 따라 조정 가능
  // 차별 표현
  '장애인', '병신같은', '정신병자', '미개인', '흑형', '짱개', '쪽바리', '양키',
  // 성적 비하
  '보지', '자지', '섹스', '야동', '야한', '19금',
  // 기타
  'ㅅㅂ', 'ㅆㅂ', 'ㅂㅅ', 'ㅈㄹ', 'ㄱㅅㄲ', 'fuck', 'shit', 'ass', 'bitch',
]

/**
 * 텍스트에 부적절한 단어가 포함되어 있는지 검사
 * 
 * @param text - 검사할 텍스트
 * @returns 부적절한 단어가 발견되면 해당 단어 배열, 없으면 빈 배열
 */
export function checkInappropriateContent(text: string): string[] {
  const foundWords: string[] = []
  const lowerText = text.toLowerCase()
  
  INAPPROPRIATE_WORDS.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word)
    }
  })
  
  return foundWords
}

/**
 * 발표 대본을 문장 단위로 나누는 함수
 * 
 * @param text - 분석할 발표 대본 텍스트
 * @returns 문장들의 배열 (빈 문자열 제거됨)
 * 
 * @example
 * const script = "안녕하세요. 오늘은 AI에 대해 말씀드리겠습니다! 궁금하신가요?"
 * const sentences = splitIntoSentences(script)
 * // ["안녕하세요", "오늘은 AI에 대해 말씀드리겠습니다", "궁금하신가요"]
 */
export function splitIntoSentences(text: string): string[] {
  // 1. 빈 문자열이면 빈 배열 반환
  if (!text || text.trim().length === 0) {
    return []
  }

  // 2. 마침표(.), 물음표(?), 느낌표(!)를 기준으로 문장을 나눔
  // 정규식 설명:
  // [.?!] - 마침표, 물음표, 느낌표 중 하나를 찾음
  // + - 연속된 문장부호도 처리 (예: "정말요?!!")
  const sentences = text.split(/[.?!]+/)

  // 3. 각 문장의 앞뒤 공백을 제거하고, 빈 문자열은 필터링
  const cleanedSentences = sentences
    .map(sentence => sentence.trim()) // 앞뒤 공백 제거
    .filter(sentence => sentence.length > 0) // 빈 문자열 제거

  return cleanedSentences
}

/**
 * 문장을 분석하여 발표 시 주의할 점을 찾아내는 함수
 * 
 * @param sentence - 분석할 문장
 * @returns 문제점들의 배열 (문제가 없으면 빈 배열)
 * 
 * @example
 * const feedback = analyzeSentence("안녕하세요")
 * // []
 * 
 * const feedback2 = analyzeSentence("오늘은 인공지능, 머신러닝, 딥러닝에 대해서 자세히 설명을 드리도록 하겠습니다")
 * // ["문장이 깁니다", "말하기 어려울 수 있습니다"]
 */
export function analyzeSentence(sentence: string): string[] {
  // 피드백을 담을 배열 생성
  const feedback: string[] = []

  // 1. 문장 길이 체크 (30자 이상인지 확인)
  if (sentence.length >= 30) {
    feedback.push('문장이 깁니다')
  }

  // 2. 쉼표 개수 체크
  // 문장에서 쉼표(,)만 추출하여 개수 세기
  const commaCount = (sentence.match(/,/g) || []).length
  // match() 함수는 쉼표를 찾으면 배열로 반환하고, 없으면 null 반환
  // || [] 를 사용하여 null일 때 빈 배열로 대체
  
  if (commaCount >= 2) {
    feedback.push('말하기 어려울 수 있습니다')
  }

  // 3. 발견된 문제점들을 배열로 반환
  return feedback
}

/**
 * 어려운 표현을 쉬운 말로 바꾸기 위한 매핑 객체
 * 
 * 발표에서 자주 사용되는 어려운 한자어나 전문용어를
 * 청중이 이해하기 쉬운 쉬운 표현으로 바꿉니다.
 */
export const WORD_SIMPLIFICATION_MAP: Record<string, string> = {
  // 동사류
  '활용하다': '쓰다',
  '활용하면': '쓰면',
  '활용할': '쓸',
  '활용합니다': '씁니다',
  
  '도출하다': '끌어내다',
  '도출하면': '끌어내면',
  '도출할': '끌어낼',
  '도출합니다': '끌어냅니다',
  
  '제공하다': '주다',
  '제공하면': '주면',
  '제공할': '줄',
  '제공합니다': '줍니다',
  
  '수행하다': '하다',
  '수행하면': '하면',
  '수행할': '할',
  '수행합니다': '합니다',
  
  '진행하다': '하다',
  '진행하면': '하면',
  '진행할': '할',
  '진행합니다': '합니다',
  
  '파악하다': '알다',
  '파악하면': '알면',
  '파악할': '알',
  '파악합니다': '압니다',
  
  '구축하다': '만들다',
  '구축하면': '만들면',
  '구축할': '만들',
  '구축합니다': '만듭니다',
  
  '검토하다': '살펴보다',
  '검토하면': '살펴보면',
  '검토할': '살펴볼',
  '검토합니다': '살펴봅니다',
  
  '실시하다': '하다',
  '실시하면': '하면',
  '실시할': '할',
  '실시합니다': '합니다',
  
  // 명사류
  '활용': '사용',
  '제공': '제공',
  '수행': '진행',
  '파악': '확인',
  '구축': '제작',
  '검토': '검사',
  '향상': '개선',
  '개선': '나아짐',
  '증진': '향상',
  '효율': '능률',
  '방안': '방법',
  '현황': '상황',
  '도모': '추구',
}

/**
 * 문장 내의 어려운 표현을 쉬운 말로 바꾸는 함수
 * 
 * @param sentence - 변환할 문장
 * @returns 쉬운 말로 바뀐 문장
 * 
 * @example
 * const result = simplifyExpression("AI를 활용하여 데이터를 도출합니다")
 * // "AI를 써서 데이터를 끌어냅니다"
 */
export function simplifyExpression(sentence: string): string {
  // 원본 문장을 복사하여 수정할 변수 생성
  let simplified = sentence

  // WORD_SIMPLIFICATION_MAP 객체의 모든 키-값 쌍을 순회
  // Object.entries()는 객체를 [키, 값] 배열로 변환
  for (const [difficult, easy] of Object.entries(WORD_SIMPLIFICATION_MAP)) {
    // 문장에 어려운 표현이 있는지 확인하고 있으면 교체
    // replaceAll()은 문장 내 모든 해당 단어를 교체
    // (예: "활용하다"가 2번 나오면 둘 다 "쓰다"로 교체)
    if (simplified.includes(difficult)) {
      simplified = simplified.replaceAll(difficult, easy)
    }
  }

  return simplified
}

/**
 * 문장의 문제점을 실제로 개선하는 함수
 * 
 * @param sentence - 개선할 문장
 * @param issues - 발견된 문제점 배열
 * @returns 문제가 개선된 문장
 */
export function improveSentence(sentence: string, issues: string[]): string {
  // 문제가 없으면 원문 그대로 반환
  if (issues.length === 0) {
    return sentence
  }
  
  let improved = sentence
  
  // 1. 기본 맞춤법 및 띄어쓰기 교정
  improved = improved
    // 조사 중복 제거
    .replace(/에 대해서/g, '에 대해')
    .replace(/에 대하여/g, '에 대해')
    .replace(/에게로/g, '에게')
    // 띄어쓰기 교정
    .replace(/말씀을\s*드리고자\s*합니다/g, '말씀드리겠습니다')
    .replace(/말씀을\s*드립니다/g, '말씀드립니다')
    .replace(/도움이\s*되었으면/g, '도움이 되길')
    .replace(/생각을\s*합니다/g, '생각합니다')
    // 불필요한 중복 표현 간결화 (주어는 보존)
    .replace(/(\S+)이라고\s*하는\s*것은/g, '$1은')
    .replace(/(\S+)라고\s*하는\s*것은/g, '$1은')
    .replace(/(\S+)을\s*하는\s*것입니다/g, '$1을 합니다')
    .replace(/(\S+)를\s*하는\s*것입니다/g, '$1를 합니다')
    .replace(/(\S+)하고자\s*합니다/g, '$1하겠습니다')
    .replace(/(\S+)라고\s*생각합니다/g, '$1라고 봅니다')
    .replace(/(\S+)이라고\s*할\s*수\s*있습니다/g, '$1입니다')
    .replace(/(\S+)라고\s*할\s*수\s*있습니다/g, '$1입니다')
    // 맞춤법 교정
    .replace(/데이타/g, '데이터')
    .replace(/어플리케이션/g, '애플리케이션')
  
  // 2. 어려운 표현을 쉬운 표현으로 변환
  improved = simplifyExpression(improved)
  
  // 3. 불필요한 수식어 제거
  improved = improved
    .replace(/매우\s+/g, '')
    .replace(/아주\s+/g, '')
    .replace(/정말\s+/g, '')
    .replace(/굉장히\s+/g, '')
    .replace(/상당히\s+/g, '')
    .replace(/엄청\s+/g, '')
    .replace(/엄청나게\s+/g, '')
    .replace(/놀라운\s+/g, '')
    .replace(/놀랍게도\s+/g, '')
    .replace(/대단한\s+/g, '')
    .replace(/대단히\s+/g, '')
  
  // 4. 문장이 긴 경우 개선
  if (issues.includes('문장이 깁니다')) {
    // 쉼표가 있으면 핵심 내용만 남기고 간결하게
    const commaIndex = improved.indexOf(',')
    if (commaIndex > 15 && commaIndex < improved.length - 1) {
      const parts = improved.split(',').map(p => p.trim())
      // 첫 번째와 두 번째 부분을 자연스럽게 연결
      if (parts.length >= 2) {
        // "~하여"로 끝나는 경우 다음 동작까지 포함
        if (parts[0].endsWith('하여') || parts[0].endsWith('으로')) {
          improved = parts[0] + ' ' + parts[1]
        } else {
          improved = parts[0]
        }
      } else {
        improved = improved.substring(0, commaIndex).trim()
      }
    }
  }
  
  // 5. 쉼표가 많은 경우 개선
  if (issues.includes('말하기 어려울 수 있습니다')) {
    // 첫 번째 쉼표까지만 사용
    const firstCommaIndex = improved.indexOf(',')
    if (firstCommaIndex > 10) {
      const beforeComma = improved.substring(0, firstCommaIndex).trim()
      const afterComma = improved.substring(firstCommaIndex + 1).trim()
      
      // 불완전한 문장인 경우 다음 부분까지 포함
      if (beforeComma.endsWith('하여') || beforeComma.endsWith('으로') || beforeComma.endsWith('으며')) {
        // 다음 동작까지 포함 (두 번째 쉼표 전까지)
        const secondCommaIndex = afterComma.indexOf(',')
        if (secondCommaIndex > 0) {
          improved = beforeComma + ' ' + afterComma.substring(0, secondCommaIndex).trim()
        } else {
          improved = beforeComma + ' ' + afterComma
        }
      } else {
        improved = beforeComma
      }
    }
  }
  
  // 6. 문장 끝 정리
  improved = improved
    // 연속된 공백 제거
    .replace(/\s+/g, ' ')
    // 양쪽 공백 제거
    .trim()
    // 중복된 어미 제거
    .replace(/합니다\s+합니다/g, '합니다')
    .replace(/니다\s+니다/g, '니다')
    .replace(/습니다\s+습니다/g, '습니다')
    .replace(/겠\s+합니다/g, '겠습니다')
  
  // 7. 불완전한 연결어미 처리
  // "~하여", "~으로", "~으며" 등으로 끝나는 경우 완전한 문장으로 만들기
  if (improved.match(/[가-힣]+하여$/)) {
    // "사용하여", "활용하여" 등 → "사용합니다", "활용합니다"
    improved = improved.replace(/하여$/, '합니다')
  } else if (improved.match(/[가-힣]+으며$/)) {
    // "이루어지며" 등 → "이루어집니다"
    improved = improved.replace(/으며$/, '습니다')
  } else if (improved.match(/[가-힣]+으로$/)) {
    // "데이터로" 등 → "데이터를 사용합니다"
    improved = improved.replace(/으로$/, '를 사용합니다')
  } else if (improved.match(/[가-힣]+하고$/)) {
    // "분석하고" 등 → "분석합니다"
    improved = improved.replace(/하고$/, '합니다')
  } else if (improved.match(/[가-힣]+고$/)) {
    // "~고"로 끝나는 경우 → "~습니다"
    improved = improved.replace(/고$/, '습니다')
  }
  
  // 8. 자연스러운 어미 확인 (이미 완전한 문장인지 체크)
  const hasProperEnding = /[다요]$/.test(improved) || /[.!?]$/.test(improved)
  
  if (!hasProperEnding) {
    // 어미가 없는 경우만 추가
    if (improved.endsWith('것')) {
      improved = improved + '입니다'
    }
  }
  
  return improved
}

/**
 * 문장 분석 결과를 담는 타입
 */
export interface SentenceAnalysisResult {
  original: string       // 원래 문장
  issues: string[]       // 문제점 배열
  improved: string       // 개선된 문장 (쉬운 표현으로 변환)
}

/**
 * 문장 배열을 입력받아 각 문장을 분석하고 개선안을 제공하는 함수
 * 
 * @param sentences - 분석할 문장들의 배열
 * @returns 각 문장의 분석 결과 객체 배열
 * 
 * @example
 * const sentences = ["AI를 활용합니다", "오늘은 인공지능, 머신러닝, 딥러닝에 대해 설명합니다"]
 * const results = analyzeSentences(sentences)
 * // [
 * //   { original: "AI를 활용합니다", issues: [], improved: "AI를 씁니다" },
 * //   { original: "오늘은 인공지능...", issues: ["문장이 깁니다", "말하기 어려울 수 있습니다"], improved: "..." }
 * // ]
 */
export function analyzeSentences(sentences: string[]): SentenceAnalysisResult[] {
  // 문장 배열을 순회하면서 각 문장을 분석
  return sentences.map((sentence) => {
    // 1. 문장의 문제점 분석
    const issues = analyzeSentence(sentence)
    
    // 2. 발견된 문제점을 실제로 개선
    const improved = improveSentence(sentence, issues)
    
    // 3. 분석 결과 객체 생성하여 반환
    return {
      original: sentence,   // 원래 문장
      issues: issues,       // 발견된 문제점들
      improved: improved    // 개선된 문장
    }
  })
}

/**
 * 발표 전체 구조 피드백을 담는 타입
 */
export interface PresentationFeedback {
  introduction: string   // 도입 피드백
  flow: string          // 흐름 피드백
  conclusion: string    // 마무리 피드백
}

/**
 * 발표 전체 텍스트를 분석하여 구조적 피드백을 생성하는 함수
 * 
 * @param text - 발표 전체 텍스트
 * @returns 도입, 흐름, 마무리에 대한 피드백 객체
 * 
 * @example
 * const feedback = analyzePresentation("안녕하세요. 오늘은 AI에 대해 말씀드리겠습니다. 감사합니다.")
 * // { introduction: "...", flow: "...", conclusion: "..." }
 */
export function analyzePresentation(text: string): PresentationFeedback {
  // 1. 텍스트를 문장 단위로 나누기
  const sentences = splitIntoSentences(text)
  const totalSentences = sentences.length
  
  // 2. 도입부 분석 (첫 1-2문장)
  let introductionFeedback = ''
  if (totalSentences === 0) {
    introductionFeedback = '발표 내용을 입력해주시면 분석을 시작할게요!'
  } else if (totalSentences === 1) {
    introductionFeedback = '발표가 너무 짧아요. 도입, 본론, 마무리를 추가해보시는 건 어떨까요?'
  } else {
    const firstSentence = sentences[0]
    // 인사말이나 청중 호명이 있는지 확인
    if (firstSentence.includes('안녕') || firstSentence.includes('여러분') || firstSentence.includes('감사')) {
      introductionFeedback = '친근한 인사로 시작하셨네요! 청중의 관심을 끌기에 좋아요.'
    } else if (firstSentence.includes('오늘') || firstSentence.includes('지금부터') || firstSentence.includes('이제')) {
      introductionFeedback = '발표 주제를 명확하게 제시하셨어요. 좋은 시작이에요!'
    } else {
      introductionFeedback = '도입부에 간단한 인사나 발표 주제 소개를 추가하면 더 좋을 것 같아요.'
    }
  }
  
  // 3. 흐름 분석 (중간 문장들)
  let flowFeedback = ''
  if (totalSentences <= 2) {
    flowFeedback = '본론 내용을 좀 더 추가해보세요. 3-5개의 핵심 메시지를 전달하면 좋아요.'
  } else if (totalSentences <= 5) {
    flowFeedback = '적절한 길이의 발표예요. 각 문장이 자연스럽게 연결되는지 확인해보세요!'
  } else {
    // 문장 평균 길이 계산
    const avgLength = text.length / totalSentences
    if (avgLength > 40) {
      flowFeedback = '문장이 전반적으로 긴 편이에요. 짧게 나누면 청중이 이해하기 더 쉬워요.'
    } else if (avgLength < 15) {
      flowFeedback = '문장이 짧고 간결해요! 다만 너무 짧으면 설명이 부족할 수 있으니 주의해주세요.'
    } else {
      flowFeedback = '문장 길이가 적절하고 흐름이 자연스러워 보여요. 잘하고 계세요!'
    }
  }
  
  // 4. 마무리 분석 (마지막 1-2문장)
  let conclusionFeedback = ''
  if (totalSentences === 0) {
    conclusionFeedback = '마무리 멘트를 추가해주세요!'
  } else {
    const lastSentence = sentences[totalSentences - 1]
    // 마무리 표현이 있는지 확인
    if (lastSentence.includes('감사') || lastSentence.includes('고맙') || lastSentence.includes('들어주셔서')) {
      conclusionFeedback = '감사 인사로 마무리하셨네요. 청중에게 좋은 인상을 남길 수 있어요!'
    } else if (lastSentence.includes('마치') || lastSentence.includes('끝') || lastSentence.includes('이상')) {
      conclusionFeedback = '발표를 깔끔하게 마무리하셨어요. 완벽해요!'
    } else if (lastSentence.includes('?')) {
      conclusionFeedback = '질문으로 끝내셨네요. 청중과의 소통을 유도하는 좋은 방법이에요!'
    } else {
      conclusionFeedback = '마무리에 감사 인사나 핵심 메시지 요약을 추가하면 더 좋을 것 같아요.'
    }
  }
  
  // 5. 피드백 객체 반환
  return {
    introduction: introductionFeedback,
    flow: flowFeedback,
    conclusion: conclusionFeedback
  }
}

/**
 * 발표 내용을 기반으로 예상 질문을 생성하는 함수
 * 
 * @param text - 발표 대본 텍스트
 * @returns 예상 질문 3개의 배열
 * 
 * @example
 * const questions = generateExpectedQuestions("AI를 활용하여 데이터를 분석합니다")
 * // ["AI 기술의 구체적인 활용 방안이 궁금합니다", ...]
 */
export function generateExpectedQuestions(text: string): string[] {
  // 빈 텍스트면 기본 질문 반환
  if (!text || text.trim().length === 0) {
    return [
      '발표 내용에 대해 좀 더 자세히 설명해주실 수 있나요?',
      '이 주제를 선택하신 특별한 이유가 있으신가요?',
      '실제로 적용해본 사례가 있으신가요?'
    ]
  }

  // 텍스트를 소문자로 변환하여 키워드 매칭에 사용
  const lowerText = text.toLowerCase()
  
  // 질문 템플릿 배열 (조건에 따라 다른 질문 선택)
  const questions: string[] = []
  
  // 1. 기술/도구 관련 키워드가 있는 경우
  if (lowerText.includes('ai') || lowerText.includes('인공지능') || 
      lowerText.includes('머신러닝') || lowerText.includes('딥러닝')) {
    const techQuestions = [
      'AI 기술의 구체적인 활용 방안에 대해 더 설명해주실 수 있을까요?',
      '이 기술을 도입할 때 예상되는 어려움은 무엇인가요?',
      '해당 기술의 정확도나 성능은 어느 정도인가요?'
    ]
    questions.push(techQuestions[Math.floor(Math.random() * techQuestions.length)])
  }
  
  // 2. 데이터 관련 키워드
  else if (lowerText.includes('데이터') || lowerText.includes('분석') || 
           lowerText.includes('정보')) {
    const dataQuestions = [
      '데이터 수집 과정에서 가장 중요하게 고려한 점은 무엇인가요?',
      '분석 결과의 신뢰도는 어떻게 검증하셨나요?',
      '개인정보 보호는 어떻게 처리하시나요?'
    ]
    questions.push(dataQuestions[Math.floor(Math.random() * dataQuestions.length)])
  }
  
  // 3. 프로젝트/개발 관련
  else if (lowerText.includes('프로젝트') || lowerText.includes('개발') || 
           lowerText.includes('구현') || lowerText.includes('만들')) {
    const projectQuestions = [
      '개발 과정에서 가장 어려웠던 부분은 무엇이었나요?',
      '프로젝트 진행 기간은 얼마나 걸렸나요?',
      '향후 추가하고 싶은 기능이 있으신가요?'
    ]
    questions.push(projectQuestions[Math.floor(Math.random() * projectQuestions.length)])
  }
  
  // 4. 비즈니스/서비스 관련
  else if (lowerText.includes('서비스') || lowerText.includes('사용자') || 
           lowerText.includes('고객') || lowerText.includes('시장')) {
    const businessQuestions = [
      '타겟 사용자층은 어떻게 되나요?',
      '경쟁 서비스와의 차별점은 무엇인가요?',
      '수익 모델은 어떻게 구상하고 계신가요?'
    ]
    questions.push(businessQuestions[Math.floor(Math.random() * businessQuestions.length)])
  }
  
  // 5. 기본 질문 (특정 키워드가 없는 경우)
  else {
    const generalQuestions = [
      '이 주제에 관심을 갖게 된 계기가 궁금합니다',
      '실제 적용 사례나 결과가 있다면 공유해주실 수 있나요?',
      '앞으로의 발전 방향은 어떻게 생각하고 계신가요?'
    ]
    questions.push(generalQuestions[Math.floor(Math.random() * generalQuestions.length)])
  }
  
  // 항상 추가되는 공통 질문들
  const commonQuestions = [
    '질문입니다. 예상되는 한계점이나 개선이 필요한 부분은 무엇인가요?',
    '다른 방법론이나 접근 방식도 고려해보셨는지 궁금합니다',
    '이 내용을 실무에 적용한다면 어떤 점을 주의해야 할까요?',
    '참고하신 자료나 레퍼런스가 있다면 추천 부탁드립니다',
    '비전문가도 쉽게 이해할 수 있도록 한 문장으로 요약해주실 수 있나요?'
  ]
  
  // 랜덤하게 2개 더 추가 (총 3개)
  const shuffled = commonQuestions.sort(() => Math.random() - 0.5)
  questions.push(shuffled[0])
  questions.push(shuffled[1])
  
  return questions.slice(0, 3)
}

/**
 * 발표 전체 분석 결과를 담는 타입
 */
export interface FullAnalysisResult {
  sentences: string[]                      // 분리된 문장들
  sentenceAnalysis: SentenceAnalysisResult[]  // 각 문장의 분석 결과
  presentationFeedback: PresentationFeedback  // 전체 발표 피드백
  expectedQuestions: string[]              // 예상 질문 3개
}

/**
 * 발표 대본을 종합적으로 분석하는 통합 함수
 * 
 * 이 함수는 다음 모든 분석을 한 번에 수행합니다:
 * 1. 문장 분리
 * 2. 각 문장 평가 (길이, 쉼표 개수)
 * 3. 어려운 표현을 쉬운 말로 변환
 * 4. 전체 발표 구조 피드백 (도입, 흐름, 마무리)
 * 5. 예상 질문 생성
 * 
 * @param text - 분석할 발표 대본 전체 텍스트
 * @returns 모든 분석 결과를 담은 객체
 * 
 * @example
 * const result = analyzeFullPresentation("안녕하세요. AI를 활용합니다.")
 * console.log(result.sentences) // ["안녕하세요", "AI를 활용합니다"]
 * console.log(result.presentationFeedback.introduction) // "친근한 인사로 시작하셨네요!"
 */
export function analyzeFullPresentation(text: string): FullAnalysisResult {
  // 1. 문장 분리
  const sentences = splitIntoSentences(text)
  
  // 2. 각 문장 분석 (문제점 파악 + 쉬운 표현 변환)
  const sentenceAnalysis = analyzeSentences(sentences)
  
  // 3. 전체 발표 구조 피드백
  const presentationFeedback = analyzePresentation(text)
  
  // 4. 예상 질문 생성
  const expectedQuestions = generateExpectedQuestions(text)
  
  // 5. 모든 결과를 하나의 객체로 반환
  return {
    sentences,
    sentenceAnalysis,
    presentationFeedback,
    expectedQuestions
  }
}
