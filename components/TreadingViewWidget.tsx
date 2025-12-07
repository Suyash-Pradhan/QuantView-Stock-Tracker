'use client'
import useTradinWidget from '@/app/hooks/useTradinWidget';
import { cn } from '@/lib/utils';
// TradingViewWidget.jsx
import React, { memo } from 'react';
interface TradingViewWidgetProps {
  title?: string;
  scriptURL: string;
  config: Record<string, unknown>;
  height?: number;
  classname?: string;
}

function TradingViewWidget({ title, scriptURL, config, height = 600, classname }: TradingViewWidgetProps) {
  const container = useTradinWidget(scriptURL, config, height);

  return (
    <div className='w-full'>
      {title && <h3 className='text-2xl text-gray-100 mb-5 font-semibold'>{title}</h3>}

      <div className={cn("tradingview-widget-container", classname)} ref={container}>
        <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>

      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
