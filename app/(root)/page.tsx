import TreadingViewWidget from '@/components/TreadingViewWidget'
import { Button } from '@/components/ui/button'
import React from 'react'
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constants'
import { getNews } from '@/lib/action/finnhub.actions'

function page() {
  const scriptURL = 'https://s3.tradingview.com/external-embedding/embed-widget-';
  return (
    <div className='flex min-h-screen home-wrapper'>
      <section className='grid w-full gap-8 home-section'>
        <div className='md:col-span-1 xl:col-span-1'>
          <TreadingViewWidget
            title='Market Overview'
            scriptURL={`${scriptURL}market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            classname='custom-chart'
            height={600}
          />
        </div>
        <div className='md:col-span-1 xl:col-span-2'>
          <TreadingViewWidget
            title='Stock Heat Map'
            scriptURL={`${scriptURL}stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            classname='custom-chart'
            height={600}
          />
        </div>
      </section>
      <section className='grid w-full gap-8 home-section'>
        <div className='h-full md:col-span-1 xl:col-span-1'>
          <TreadingViewWidget

            scriptURL={`${scriptURL}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}

            height={600}
          />
        </div>
        <div className='h-full md:col-span-1 xl:col-span-2'>
          <TreadingViewWidget

            scriptURL={`${scriptURL}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}

            height={600}
          />
        </div>
      </section>
    </div>
  )
}

export default page
