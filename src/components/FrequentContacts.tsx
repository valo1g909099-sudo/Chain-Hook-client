import { useState, useEffect } from 'react';
import { User, Loader2 } from 'lucide-react';
import { walletService } from '@/services/walletService';

interface Contact {
  name: string;
  address: string;
}

export default function FrequentContacts({ onSelectContact }: { onSelectContact?: (address: string) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const txs = await walletService.getTransactions();
        const uniqueNames = new Set<string>();
        const list: Contact[] = [];

        txs.forEach((tx) => {
          const name = tx.entity;
          if (
            name &&
            !name.includes('Conversion') &&
            !name.includes('FX Swap') &&
            !uniqueNames.has(name)
          ) {
            uniqueNames.add(name);
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
              hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            const block = (num: number) => String(Math.abs(num) % 10000).padStart(4, '0');
            const address = `CH-WAL-${block(hash)}-${block(hash >> 8)}-${block(hash >> 16)}`;
            list.push({ name, address });
          }
        });

        if (list.length === 0) {
          const fallbacks = ['Stripe Payout', 'Goldman Sachs Payout', 'Google AdSense', 'CloudFlare API'];
          fallbacks.forEach((name, i) => {
            list.push({
              name,
              address: `CH-WAL-${3000 + i * 100}-${4000 + i * 200}-${5000 + i * 300}`,
            });
          });
        }

        setContacts(list);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg h-[220px] flex flex-col">
      <h3 className="text-xs font-semibold text-white mb-3">Quick Contacts</h3>
      <div className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="text-[#D4AF37] animate-spin" size={16} />
          </div>
        ) : (
          contacts.map((c, index) => (
            <div
              key={index}
              onClick={() => onSelectContact?.(c.address)}
              className="flex items-center gap-2 p-2 hover:bg-[#1C1C24]/30 rounded-lg cursor-pointer transition-colors"
              title={`Click to copy address: ${c.address}`}
            >
              <div className="p-1.5 bg-[#0D0D12] rounded-lg text-[#D4AF37] shrink-0">
                <User size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-white font-medium truncate">{c.name}</p>
                <p className="text-[8px] text-[#71717A] truncate font-mono">{c.address}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
