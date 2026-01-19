/**
 * useTokenEvents Hook
 * 
 * Hook for listening to token-related events on Base.
 * Tracks Transfer, Approval, and TokenCreated events.
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useWatchContractEvent, useChainId } from 'wagmi';
import { type Address, type Log, parseAbiItem } from 'viem';

/**
 * Transfer event type
 */
interface TransferEvent {
  type: 'transfer';
  from: Address;
  to: Address;
  value: bigint;
  transactionHash: string;
  blockNumber: bigint;
  timestamp?: number;
}

/**
 * Approval event type
 */
interface ApprovalEvent {
  type: 'approval';
  owner: Address;
  spender: Address;
  value: bigint;
  transactionHash: string;
  blockNumber: bigint;
  timestamp?: number;
}

type TokenEvent = TransferEvent | ApprovalEvent;

interface UseTokenEventsOptions {
  tokenAddress?: Address;
  filterAddress?: Address; // Filter by from/to/owner address
  maxEvents?: number;
}

interface UseTokenEventsReturn {
  events: TokenEvent[];
  isLoading: boolean;
  error: Error | null;
  clearEvents: () => void;
}

/**
 * ERC20 Transfer event ABI
 */
const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)'
);

/**
 * ERC20 Approval event ABI
 */
const APPROVAL_EVENT = parseAbiItem(
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
);

export function useTokenEvents(
  options: UseTokenEventsOptions = {}
): UseTokenEventsReturn {
  const { tokenAddress, filterAddress, maxEvents = 50 } = options;
  
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const [events, setEvents] = useState<TokenEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Add new event to the list
  const addEvent = useCallback((newEvent: TokenEvent) => {
    setEvents(prev => {
      const updated = [newEvent, ...prev];
      // Keep only the max number of events
      return updated.slice(0, maxEvents);
    });
  }, [maxEvents]);

  // Watch for Transfer events
  useWatchContractEvent({
    address: tokenAddress,
    abi: [TRANSFER_EVENT],
    eventName: 'Transfer',
    onLogs: (logs) => {
      logs.forEach(log => {
        const args = log.args as { from: Address; to: Address; value: bigint };
        
        // Apply filter if specified
        if (filterAddress) {
          if (args.from !== filterAddress && args.to !== filterAddress) {
            return;
          }
        }

        addEvent({
          type: 'transfer',
          from: args.from,
          to: args.to,
          value: args.value,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        });
      });
    },
    enabled: !!tokenAddress,
  });

  // Watch for Approval events
  useWatchContractEvent({
    address: tokenAddress,
    abi: [APPROVAL_EVENT],
    eventName: 'Approval',
    onLogs: (logs) => {
      logs.forEach(log => {
        const args = log.args as { owner: Address; spender: Address; value: bigint };
        
        // Apply filter if specified
        if (filterAddress && args.owner !== filterAddress) {
          return;
        }

        addEvent({
          type: 'approval',
          owner: args.owner,
          spender: args.spender,
          value: args.value,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        });
      });
    },
    enabled: !!tokenAddress,
  });

  // Fetch historical events on mount
  useEffect(() => {
    if (!tokenAddress || !publicClient) return;

    const fetchHistoricalEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get events from the last 1000 blocks
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > 1000n ? currentBlock - 1000n : 0n;

        // Fetch Transfer events
        const transferLogs = await publicClient.getLogs({
          address: tokenAddress,
          event: TRANSFER_EVENT,
          fromBlock,
          toBlock: currentBlock,
        });

        // Convert logs to events
        const historicalEvents: TokenEvent[] = transferLogs.map(log => {
          const args = log.args as { from: Address; to: Address; value: bigint };
          return {
            type: 'transfer' as const,
            from: args.from,
            to: args.to,
            value: args.value,
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
          };
        });

        // Filter if needed
        const filteredEvents = filterAddress
          ? historicalEvents.filter(e => 
              e.type === 'transfer' && (e.from === filterAddress || e.to === filterAddress)
            )
          : historicalEvents;

        // Sort by block number descending and limit
        const sortedEvents = filteredEvents
          .sort((a, b) => Number(b.blockNumber - a.blockNumber))
          .slice(0, maxEvents);

        setEvents(sortedEvents);
      } catch (err) {
        console.error('Failed to fetch historical events:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalEvents();
  }, [tokenAddress, filterAddress, publicClient, maxEvents]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isLoading,
    error,
    clearEvents,
  };
}

/**
 * Hook for watching factory token creation events
 */
interface TokenCreatedEvent {
  creator: Address;
  tokenAddress: Address;
  name: string;
  symbol: string;
  transactionHash: string;
  blockNumber: bigint;
}

export function useTokenCreatedEvents(
  factoryAddress?: Address,
  creatorFilter?: Address
) {
  const [events, setEvents] = useState<TokenCreatedEvent[]>([]);

  // Token Created event ABI
  const TOKEN_CREATED_EVENT = parseAbiItem(
    'event TokenCreated(address indexed creator, address indexed token, string name, string symbol)'
  );

  useWatchContractEvent({
    address: factoryAddress,
    abi: [TOKEN_CREATED_EVENT],
    eventName: 'TokenCreated',
    onLogs: (logs) => {
      logs.forEach(log => {
        const args = log.args as {
          creator: Address;
          token: Address;
          name: string;
          symbol: string;
        };

        // Apply filter if specified
        if (creatorFilter && args.creator !== creatorFilter) {
          return;
        }

        setEvents(prev => [{
          creator: args.creator,
          tokenAddress: args.token,
          name: args.name,
          symbol: args.symbol,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        }, ...prev].slice(0, 50));
      });
    },
    enabled: !!factoryAddress,
  });

  return { events };
}
