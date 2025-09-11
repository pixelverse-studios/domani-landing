import { ReactElement } from 'react'

export interface MockupOptions {
  width?: number
  height?: number
  device?: 'mobile' | 'desktop'
  theme?: 'light' | 'dark'
  showStatusBar?: boolean
  showHomeIndicator?: boolean
}

export function generateMockupScreenshot(
  content: ReactElement,
  options: MockupOptions = {}
): ReactElement {
  const {
    width = 375,
    height = 812,
    device = 'mobile',
    theme = 'dark',
    showStatusBar = true,
    showHomeIndicator = true,
  } = options

  const isMobile = device === 'mobile'

  // Create a wrapper with device frame styling
  const mockupElement = (
    <div className="relative">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      >
        {/* Background */}
        <rect
          width={width}
          height={height}
          fill={theme === 'dark' ? '#111827' : '#ffffff'}
          rx={isMobile ? 40 : 12}
        />

        {/* Status Bar (Mobile) */}
        {isMobile && showStatusBar && (
          <>
            <text
              x="30"
              y="30"
              fill={theme === 'dark' ? '#ffffff' : '#111827'}
              fontSize="14"
              fontWeight="500"
            >
              9:41
            </text>
            <g transform={`translate(${width - 70}, 20)`}>
              {/* Battery Icon */}
              <rect
                x="40"
                y="4"
                width="24"
                height="12"
                stroke={theme === 'dark' ? '#ffffff' : '#111827'}
                strokeWidth="1"
                fill="none"
                rx="2"
              />
              <rect
                x="42"
                y="6"
                width="18"
                height="8"
                fill={theme === 'dark' ? '#ffffff' : '#111827'}
              />
              {/* WiFi Icon */}
              <path
                d="M20 8 L24 4 L28 8"
                stroke={theme === 'dark' ? '#ffffff' : '#111827'}
                strokeWidth="1.5"
                fill="none"
              />
              {/* Signal Bars */}
              <rect x="0" y="10" width="3" height="6" fill={theme === 'dark' ? '#ffffff' : '#111827'} />
              <rect x="5" y="8" width="3" height="8" fill={theme === 'dark' ? '#ffffff' : '#111827'} />
              <rect x="10" y="6" width="3" height="10" fill={theme === 'dark' ? '#ffffff' : '#111827'} />
            </g>
          </>
        )}

        {/* Home Indicator (Mobile) */}
        {isMobile && showHomeIndicator && (
          <rect
            x={width / 2 - 60}
            y={height - 15}
            width="120"
            height="4"
            fill={theme === 'dark' ? '#ffffff' : '#111827'}
            opacity="0.3"
            rx="2"
          />
        )}
      </svg>

      {/* Content Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          padding: isMobile ? '60px 20px 40px' : '20px',
        }}
      >
        {content}
      </div>
    </div>
  )

  return mockupElement
}

export interface ComparisonOptions {
  beforeContent: ReactElement
  afterContent: ReactElement
  beforeLabel?: string
  afterLabel?: string
  orientation?: 'horizontal' | 'vertical'
}

export function generateComparisonImage({
  beforeContent,
  afterContent,
  beforeLabel = 'Before',
  afterLabel = 'After',
  orientation = 'horizontal',
}: ComparisonOptions): ReactElement {
  return (
    <div
      className={`flex ${
        orientation === 'horizontal' ? 'flex-row' : 'flex-col'
      } gap-8`}
    >
      {/* Before */}
      <div className="flex-1">
        <div className="text-center mb-4">
          <span className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            {beforeLabel}
          </span>
        </div>
        <div className="opacity-60">
          {beforeContent}
        </div>
      </div>

      {/* Divider */}
      <div 
        className={`flex items-center justify-center ${
          orientation === 'horizontal' ? 'w-px' : 'h-px w-full'
        }`}
      >
        <div 
          className={`bg-gradient-to-${
            orientation === 'horizontal' ? 'b' : 'r'
          } from-transparent via-gray-400 dark:via-gray-600 to-transparent ${
            orientation === 'horizontal' ? 'w-px h-full' : 'h-px w-full'
          }`}
        />
      </div>

      {/* After */}
      <div className="flex-1">
        <div className="text-center mb-4">
          <span className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium">
            {afterLabel}
          </span>
        </div>
        <div>
          {afterContent}
        </div>
      </div>
    </div>
  )
}