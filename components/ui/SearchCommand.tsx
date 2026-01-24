"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { searchStocks } from "@/lib/action/finnhub.actions";
import { useDebounce } from "@/app/hooks/useDebounce";

// Mock stock data for testing
const MOCK_STOCKS: StockWithWatchlistStatus[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    type: "Common Stock",
    isInWatchlist: false,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    type: "Common Stock",
    isInWatchlist: true,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    type: "Common Stock",
    isInWatchlist: false,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    type: "Common Stock",
    isInWatchlist: true,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    type: "Common Stock",
    isInWatchlist: false,
  },
];
function normalize(str:string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");   // 🔥 remove spaces, dots, symbols, everything
}
export function CommandManyItems({ initialStocks, renderAs, label }: SearchProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncevalue = useDebounce(searchValue, 300);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const SearchMode = !!searchValue;
  const displayStock = SearchMode ? stock : stock.slice(0, 10);

  const handleSelectStock = async () => {
    setStock(initialStocks);
    setSearchValue('');
    setOpen(false);
  }
  
  useEffect(() => {
    const fetchStocks = async () => {

      if (!debouncevalue) {
      
        setStock(initialStocks);
        return;
      }
      setLoading(true);
      try {
        const res = await searchStocks(normalize(debouncevalue));
       
        setStock(res);
      } catch {
        setStock([]);
      }
      finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, [debouncevalue])

  return (
    <div className="flex flex-col gap-4">
      {renderAs === 'text' ? (
        <span onClick={() => { setOpen(true) }} className="search-text">
          {label}
        </span>
      ) : (
        <button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <Command shouldFilter={false}>
          <CommandInput value={searchValue} onValueChange={setSearchValue} placeholder="Type a command or search..." />
          {loading && <Loader2 className="search-loader" />}
          <CommandList>
            {
              loading ?
                (
                  <CommandEmpty className="search-list-empty">
                    Loading...
                  </CommandEmpty>
                ) : displayStock?.length === 0 ? (
                  <CommandEmpty className="search-list-empty">{
                    SearchMode ? 'No results found' : 'No stocks available'
                  }</CommandEmpty>
                ) : (
                  <CommandGroup heading={SearchMode ? 'Search results' : 'Popular stocks'}>
                    {displayStock.map((stockItem) => (
                      <CommandItem key={stockItem.symbol} >
                        <Link
                          href={`/stocks/${stockItem.symbol}`}
                          onClick={handleSelectStock}
                          className="flex items-center gap-2 w-full"
                        >
                          <TrendingUp className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{stockItem.symbol}</span>
                            <span className="text-xs text-gray-500">{stockItem.name} | {stockItem.type}</span>
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
