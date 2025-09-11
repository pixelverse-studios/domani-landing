import type { Benefit } from './types'

const BrainIcon = () => (
  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M9.75 3.5C11.5 2 14.5 2 16.25 3.5C18 5 18 8 16.25 9.5L12 14L7.75 9.5C6 8 6 5 7.75 3.5C8.625 2.75 9.75 2.5 10.875 2.5C11 2.5 11.125 2.5 11.25 2.5M12 14V21M9 18H15" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M7 7C5.5 7 4 8 4 10C4 12 5.5 13 7 13M17 7C18.5 7 20 8 20 10C20 12 18.5 13 17 13" />
  </svg>
)

const BatteryIcon = () => (
  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M10 2H5C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H10M14 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H14M10 2H14M10 22H14M7 7V17" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
      d="M7 7H10M7 12H10M7 17H10M14 7H17M14 12H17M14 17H17" className="text-primary-400" />
  </svg>
)

const TargetIcon = () => (
  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="12" cy="12" r="6" strokeWidth={2} className="text-primary-500" />
    <circle cx="12" cy="12" r="2" strokeWidth={2} className="text-primary-400" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 2V6M12 18V22M2 12H6M18 12H22" />
  </svg>
)

const MemoryIcon = () => (
  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M9 9H9.01M15 9H15.01M9 15H9.01M15 15H15.01M12 12H12.01" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
      d="M4 9H2M4 15H2M20 9H22M20 15H22M9 4V2M15 4V2M9 20V22M15 20V22" className="text-primary-400" />
  </svg>
)

export const benefitsData: Benefit[] = [
  {
    id: 'zeigarnik',
    title: 'Zeigarnik Effect',
    description: 'Your brain naturally remembers unfinished tasks 90% better. Domani harnesses this by creating the perfect "open loops" that keep you motivated.',
    icon: <BrainIcon />,
    statistic: {
      value: 90,
      suffix: '%',
      label: 'Better task recall'
    },
    citation: {
      authors: 'Zeigarnik, B.',
      year: 1927,
      title: 'On Finished and Unfinished Tasks',
      journal: 'Psychologische Forschung',
      url: 'https://doi.org/10.1007/BF02409755'
    }
  },
  {
    id: 'decision-fatigue',
    title: 'Beat Decision Fatigue',
    description: 'Save your 35,000 daily decisions for what matters. Pre-plan tasks when your mind is fresh, execute when energy is lower.',
    icon: <BatteryIcon />,
    statistic: {
      value: 35,
      suffix: 'k',
      label: 'Daily decisions saved'
    },
    citation: {
      authors: 'Baumeister, R. F., et al.',
      year: 2008,
      title: 'Free will in consumer behavior: Self-control, ego depletion, and choice',
      journal: 'Journal of Consumer Psychology',
      url: 'https://doi.org/10.1016/j.jcps.2008.04.006'
    }
  },
  {
    id: 'implementation',
    title: 'If-Then Planning',
    description: 'Implementation intentions boost goal achievement by 65%. Domani creates automatic behavioral triggers for consistent execution.',
    icon: <TargetIcon />,
    statistic: {
      value: 65,
      suffix: '%',
      label: 'Higher goal achievement'
    },
    citation: {
      authors: 'Gollwitzer, P. M. & Sheeran, P.',
      year: 2006,
      title: 'Implementation intentions and goal achievement: A meta-analysis',
      journal: 'Advances in Experimental Social Psychology',
      url: 'https://doi.org/10.1016/S0065-2601(06)38002-1'
    }
  },
  {
    id: 'working-memory',
    title: 'Working Memory',
    description: 'Your brain juggles 3-5 items max. Domani externalizes your mental load, freeing cognitive resources for deep work.',
    icon: <MemoryIcon />,
    statistic: {
      value: 5,
      suffix: 'x',
      label: 'Mental clarity boost'
    },
    citation: {
      authors: 'Cowan, N.',
      year: 2010,
      title: 'The Magical Mystery Four: How is Working Memory Capacity Limited',
      journal: 'Current Directions in Psychological Science',
      url: 'https://doi.org/10.1177/0963721409359277'
    }
  }
]