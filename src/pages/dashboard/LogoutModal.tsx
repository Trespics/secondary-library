import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <LogOut className="modal-icon" />
          <h3 className="modal-title">Sign Out</h3>
        </div>
        <p className="modal-text">Are you sure you want to sign out of your account?</p>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button confirm">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}