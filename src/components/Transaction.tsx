import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import TransferForm from './TransferForm';
import TransferQuickActions from './TransferQuickActions';
import FrequentContacts from './FrequentContacts';
import RecentTransfers from './RecentTransfers';
import TransferStats from './TransferStats';
import NeedHelp from './NeedHelp';
import ExchangeRateSummary from './ExchangeRateSummary';
import SecurityStatus from './SecurityStatus';
import SupportCard from './SupportCard';
import PaymentAddressCard from './PaymentAddressCard';
import { walletService } from '@/services/walletService';
import { settingsService } from '@/services/settingsservice';

export default function Transaction() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Peer Transfer');
  const [useLmt, setUseLmt] = useState(0);
  const [maxLmt, setMaxLmt] = useState(5000);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [usdBalance, setUsdBalance] = useState(42108.45);

  useEffect(() => {
    const loadData = async () => {
      try {
        const balData = await walletService.getBalances();
        if (balData.USD !== undefined) setUsdBalance(parseFloat(balData.USD as string) || 0);
        if (balData.use_lmt !== undefined) setUseLmt(balData.use_lmt);
        if (balData.max_lmt !== undefined) setMaxLmt(balData.max_lmt);
      } catch (err) {
        console.warn(err);
      }

      try {
        const settingsData = await settingsService.getAll();
        const enabled = 
          (settingsData.privacy?.auth_2f) || 
          (settingsData.security_2fa?.authenticator_app) || 
          (settingsData.security_2fa?.OTP) || 
          (settingsData.security_2fa?.B_T);
        setIs2faEnabled(!!enabled);
      } catch (err) {
        console.warn(err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-4">
        <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Wallet className="text-[#D4AF37]" size={14} />
          <div>
            <p className="text-[9px] text-[#9A9AA5]">Balance</p>
            <p className="text-xs font-semibold text-white">${usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ExchangeRateSummary />
          <SecurityStatus is2faEnabled={is2faEnabled} />
          <TransferStats maxLmt={maxLmt} useLmt={useLmt} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TransferForm recipient={recipient} setRecipient={setRecipient} amount={amount} setAmount={setAmount} type={type} setType={setType} />
            <TransferQuickActions />
        </div>

        <div className="space-y-4 flex flex-col gap-4">
          <PaymentAddressCard />
          <FrequentContacts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentTransfers />
          </div>
          <div className="space-y-4">
            <SupportCard />
            <NeedHelp />
          </div>
      </div>
    </div>
  );
}
