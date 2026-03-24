export interface TourStep {
  id: string
  target?: string // data-tour selector
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  navigateTo?: string // route to navigate to before showing this step
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SeaTrees Intelligence',
    content: 'This guided tour will show you the key features of your marine biodiversity dashboard. Let\'s get started!',
    navigateTo: '/dashboard',
  },
  {
    id: 'key-metrics',
    target: '[data-tour="key-metrics"]',
    title: 'Key Metrics',
    content: 'Track your portfolio metrics at a glance — total projects, ecosystems, blocks retired, and revenue.',
    placement: 'bottom',
    navigateTo: '/dashboard',
  },
  {
    id: 'nav-map',
    target: '[data-tour="nav-map"]',
    title: 'Project Map',
    content: 'Interactive map of all 24 restoration sites across 6 marine ecosystems worldwide.',
    placement: 'bottom',
    navigateTo: '/dashboard',
  },
  {
    id: 'nav-credits',
    target: '[data-tour="nav-credits"]',
    title: 'Credit Intelligence',
    content: 'Explore Biodiversity Block credit intelligence — market position, explainers, and framework comparisons.',
    placement: 'right',
    navigateTo: '/credits',
  },
  {
    id: 'nav-verification',
    target: '[data-tour="nav-verification"]',
    title: 'On-Chain Verification',
    content: 'Query the Regen Network blockchain directly — live retirement data, batch timelines, and verification chains.',
    placement: 'right',
    navigateTo: '/verification',
  },
  {
    id: 'nav-stories',
    target: '[data-tour="nav-stories"]',
    title: 'Impact Stories',
    content: 'Auto-generated impact stories for your communications team — PMU updates, explainers, FAQs, and comparisons.',
    placement: 'right',
    navigateTo: '/stories',
  },
  {
    id: 'demo-toggle',
    target: '[data-tour="demo-toggle"]',
    title: 'Demo Mode',
    content: 'Toggle demo mode to customize data presentation for different audiences.',
    placement: 'bottom',
  },
  {
    id: 'finish',
    title: "You're All Set!",
    content: 'Explore the dashboard at your own pace. You can restart this tour anytime from the header.',
    navigateTo: '/dashboard',
  },
]
